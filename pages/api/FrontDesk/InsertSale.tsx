import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/FrontDesk/InsertSale:
 *   post:
 *     summary: Inserts a new sale
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: The ID of the sale
 *       - in: query
 *         name: isreg
 *         schema:
 *           type: boolean
 *         description: Whether the customer is registered
 *       - in: query
 *         name: change
 *         schema:
 *           type: integer
 *         description: The amount of change to give the customer
 *       - in: query
 *         name: ischange
 *         schema:
 *           type: boolean
 *         description: Whether to update the customer's change
 *       - in: query
 *         name: usechange
 *         schema:
 *           type: boolean
 *         description: Whether to use the customer's change
 *       - in: query
 *         name: tank
 *         schema:
 *           type: string
 *         description: The ID of the tank
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       200:
 *         description: The created sale
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 */
export default async (req:any, res:any) => {
    let data = req.body;
    let { id, isreg, change, ischange, usechange, tank } = req.query
    data = JSON.parse(data);
    const customerId = data.customerId
    const branch = data.branch;
    const amount = data.amount
    
      const result = await prisma.sale.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: branch },
          },
        },
        
      });

      //Update Change
      if(ischange == 'true') {
        const updateUser = await prisma.customer.update({
          where: {
            uniqueId: customerId,
          },
          data: {
            change: 
              parseInt(change)
          },
        })
      }

      //Use Change
      if(usechange == 'true') {
        const updateChange = await prisma.customer.update({
          where: {
            uniqueId: customerId,
          },
          data: {
            change: 0
          },
        })
      }


      //Increment Purcahse Count
        const purchaseCount = await prisma.customer.updateMany({
          where: {
            uniqueId: customerId,
          },
          data: {
            purchaseCount: {
              increment: 1
            }
          },
        
      });

      console.log(isreg)
     

      const updateTank = await prisma.tank.updateMany({
          where: { 
            branchId: branch,
            tankId: tank
          },

          data: {
            amount: {
              decrement: data.totalKg
            }
          }
      });

      
      res.status(200).json(result);
  };