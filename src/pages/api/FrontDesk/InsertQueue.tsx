import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { reserveCrbNumber } from "../../../lib/crb-lock";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let data = req.body;
    
    // Some clients might send data as a string
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON body' });
      }
    }

    const branchId = parseInt(data.branchId);

    // If client provides a crbNumber, use it directly (backwards compatibility)
    if (data.crbNumber) {
      const crbNumber = parseInt(data.crbNumber);
      const result = await prisma.queue.create({
        data: {
          branch: { connect: { branchId } },
          crbNumber,
          customerId: data.customerId,
          description: data.description,
          amount: parseInt(data.amount),
          totalKg: parseFloat(data.totalKg),
          category: data.category || 'Walk-in',
          timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          date: data.date ? new Date(data.date) : new Date(),
        },
      });
      return res.status(200).json({ ...result, crbNumber });
    }
    
    // Atomically reserve CRB number + insert into queue
    const { result, crbNumber } = await reserveCrbNumber(branchId, async (tx, crbNumber) => {
      return await tx.queue.create({
        data: {
          branch: { connect: { branchId } },
          crbNumber,
          customerId: data.customerId,
          description: data.description,
          amount: parseInt(data.amount),
          totalKg: parseFloat(data.totalKg),
          category: data.category || 'Walk-in',
          timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          date: data.date ? new Date(data.date) : new Date(),
        },
      });
    });

    // Return the result with the assigned CRB number
    return res.status(200).json({ ...result, crbNumber });
  } catch (error: any) {
    console.error('Error inserting into queue:', error);
    return res.status(500).json({ message: 'Failed to insert into queue', error: error.message });
  }
};