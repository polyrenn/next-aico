import { prisma } from "../../../lib/prisma";

export default async (req: any, res: any) => {
    // Ensure request method is POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let data = req.body; // Contains sale details like totalKg, branch, customerId, etc.
    // Removed query parameters as they weren't used in the original logic for sale creation/tank update
    // let { id, isreg, change, ischange, usechange, tank } = req.query

    // Validate and parse essential numeric data
    const branchId = parseInt(data.branch, 10);
    const totalKgSold = parseFloat(data.totalKg);
    const amountReceived = parseInt(data.amount, 10); // Assuming 'amount' is the total amount paid
    const changeGiven = parseFloat(data.change || '0'); // Assuming 'change' is the change given back


    if (isNaN(branchId) || isNaN(totalKgSold) || isNaN(amountReceived) || isNaN(changeGiven)) {
      console.error("Invalid numeric input:", { branchId, totalKgSold, amountReceived, changeGiven });
      return res.status(400).json({ error: "Invalid numeric input for branch, totalKg, amount, or change." });
    }

    // Validate other required fields (adjust as needed based on your schema/logic)
    if (!data.customerId || !data.category || !data.paymentMethod || !data.narrative) {
      console.error("Missing required sale data:", {
        customerId: data.customerId,
        category: data.category,
        paymentMethod: data.paymentMethod,
        narrative: data.narrative,
      });
      return res.status(400).json({ error: "Missing required sale data (customerId, category, paymentMethod, narrative)." });
    }

    console.log("Validation passed. Proceeding with transaction...");


    try {
        const result = await prisma.$transaction(async (tx) => {
            // 0. CRB Validation: Ensure a CRB exists before creating sale
            // This prevents orphaned sales (sales without corresponding CRB records)
            const saleNumber = parseInt(data.saleNumber, 10);
            if (!saleNumber || isNaN(saleNumber)) {
                throw new Error("Invalid saleNumber. A valid CRB number is required.");
            }
            
            const crbExists = await tx.crb.findFirst({
                where: {
                    branchId: branchId,
                    crbNumber: saleNumber,
                },
            });
            
            if (!crbExists) {
                throw new Error(`No CRB found for saleNumber ${saleNumber}. Please save the invoice first before completing the sale.`);
            }

            // 1. Find the Current Tank ID for the branch
            const branchInfo = await tx.branch.findUnique({
                where: { branchId: branchId },
                select: { currentTank: true },
            });

            if (!branchInfo || !branchInfo.currentTank) {
                // Use a specific error or handle default tank logic if applicable
                throw new Error(`Branch ${branchId} not found or has no current tank assigned.`);
            }
            const currentTankId = branchInfo.currentTank;

            // 2. Get Opening Balance from the current tank (ensure tank exists)
            // Assuming tankId is globally unique as per schema `tankId String @unique`
            const tank = await tx.tank.findUnique({
                where: { tankId: currentTankId },
                select: { 
                  amount: true,
                  designation: true
                 },
            });

            if (!tank) {
                // This case should ideally not happen if currentTank is set correctly, but good to handle
                throw new Error(`Tank ${currentTankId} (assigned to branch ${branchId}) not found.`);
            }
            const openingBalance = tank.amount;

            // 3. Calculate Closing and Balance
            const closingBalance = openingBalance - totalKgSold;
            const balanceAmount = openingBalance - totalKgSold; // The amount deducted for this sale

             // Optional: Check for sufficient stock BEFORE creating the sale
             if (closingBalance < 0) {
                 // Decide whether to throw an error or just log a warning
                 // Option 1: Prevent sale if stock is insufficient
                 // throw new Error(`Insufficient stock in tank ${currentTankId}. Available: ${openingBalance}, Required: ${totalKgSold}`);

                 // Option 2: Allow sale but log warning (as in previous example)
                 console.warn(`Tank ${currentTankId} level potentially negative after sale. Opening: ${openingBalance}, Sold: ${totalKgSold}`);
             }


            // 4. Create Sale Record
            // Make sure all required fields from schema are provided
            const newSale = await tx.sale.create({
                data: {
                    // Fields directly from request body (ensure types match schema)
                    branch: {
                      connect: {
                        branchId: branchId
                      }
                    },
                    totalKg: totalKgSold,
                    amount: amountReceived,
                    category: data.category,
                    timestamp: new Date(), // Use server time for consistency
                    date: new Date(), // Or derive from timestamp if needed differently
                    customerId: data.customerId,
                    description: data.description || {}, // Provide default if optional
                    narrative: data.narrative,
                    paymentMethod: data.paymentMethod,
                    change: changeGiven,
                    saleNumber: data.saleNumber,

                    // Calculated fields
                    opening: openingBalance,
                    closing: closingBalance,
                    balance: balanceAmount, // This is the amount *sold* in this transaction
                    currentTank: tank.designation, // Store which tank was used

                    // saleNumber: // Handled by DB trigger/sequence? If not, needs logic here.
                                  // If using trigger, remove from data. If manual, fetch last + 1.
                },
                // select: { id: true } // Optionally select only needed fields
            });

            // 5. Update Tank Level
            const updatedTank = await tx.tank.update({
                where: { tankId: currentTankId },
                data: {
                    amount: {
                        decrement: totalKgSold,
                    },
                },
                // select: { amount: true } // Optionally select updated amount
            });

            // 6. Update customer purchase count for reward system (if registered customer)
            if (data.customerUniqueId && typeof data.customerUniqueId === 'string') {
                try {
                    await tx.customer.update({
                        where: { uniqueId: data.customerUniqueId },
                        data: { purchaseCount: { increment: 1 } }
                    });
                } catch (customerUpdateError) {
                    // Log but don't fail the sale if customer update fails
                    console.warn('Could not update customer purchase count:', customerUpdateError);
                }
            }

            return newSale; // Return the created sale record
        });

        // Send successful response
        res.status(200).json(result);

    } catch (error: any) {
        console.error("Sale transaction failed:", error);
        
        // Handle duplicate sale (unique constraint on [saleNumber, branchId, date])
        // This happens when a cashier retries after the first attempt actually succeeded
        if (error.code === 'P2002') {
            // The sale already exists — find and return it
            try {
                const existingSale = await prisma.sale.findFirst({
                    where: {
                        saleNumber: parseInt(req.body.saleNumber),
                        branchId: parseInt(req.body.branch, 10),
                    },
                    orderBy: { timestamp: 'desc' },
                });
                if (existingSale) {
                    return res.status(200).json({ ...existingSale, isDuplicate: true });
                }
            } catch (lookupError) {
                console.error("Failed to look up existing sale:", lookupError);
            }
        }
        
        res.status(500).json({ error: "Failed to process sale transaction.", details: error.message });
    }
    // No finally block needed here as Prisma handles connection pooling
};
