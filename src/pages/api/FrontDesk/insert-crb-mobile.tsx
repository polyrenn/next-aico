import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { reserveCrbNumber } from "../../../lib/crb-lock";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let data = req.body;
    
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    const branchId = parseInt(data.branchId);

    // Always generate a fresh CRB number via reserveCrbNumber,
    // whether this is a walk-in or a queue-based order.
    // Queue items have their own separate numbering (Q-1, Q-2, etc.)
    // that doesn't correspond to real CRB numbers.

    // Atomically reserve a CRB number + insert
    const amount = parseInt(data.amount);
    const totalKg = parseFloat(data.totalKg);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const { result, crbNumber } = await reserveCrbNumber(branchId, async (tx, crbNumber) => {
      // Idempotency check: look for a matching CRB created in the last 5 minutes
      const duplicate = await tx.crb.findFirst({
        where: {
          branchId,
          customerId: data.customerId,
          amount,
          totalKg,
          timestamp: { gte: fiveMinutesAgo },
        },
        orderBy: { timestamp: 'desc' },
      });

      if (duplicate) {
        // Return existing record instead of creating a new one
        return { ...duplicate, isDuplicate: true };
      }

      return await tx.crb.create({
        data: {
          branch: { connect: { branchId } },
          crbNumber,
          customerId: data.customerId,
          description: data.description,
          amount,
          totalKg,
          category: data.category,
          timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          date: data.date ? new Date(data.date) : new Date(),
        },
      });
    });

    // If duplicate was found, return the original CRB number
    const finalCrbNumber = (result as any).isDuplicate ? (result as any).crbNumber : crbNumber;
    res.status(200).json({ ...result, crbNumber: finalCrbNumber, isDuplicate: !!(result as any).isDuplicate });
  } catch (error: any) {
    console.error('Error inserting CRB:', error);
    res.status(500).json({ message: 'Failed to insert CRB', error: error.message });
  }
};
