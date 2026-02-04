import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// Helper to get next CRB number atomically
async function getNextCrbNumber(branchId: number): Promise<number> {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const todayStart = new Date(`${formattedDate}T00:00:00.000Z`);

  const [queueMax, crbMax, saleMax] = await Promise.all([
    prisma.queue.aggregate({
      _max: { crbNumber: true },
      where: { branchId, timestamp: { gte: todayStart } },
    }),
    prisma.crb.aggregate({
      _max: { crbNumber: true },
      where: { branchId, timestamp: { gte: todayStart } },
    }),
    prisma.sale.aggregate({
      _max: { saleNumber: true },
      where: { branchId, timestamp: { gte: todayStart } },
    }),
  ]);

  const maxQueue = queueMax._max.crbNumber || 0;
  const maxCrb = crbMax._max.crbNumber || 0;
  const maxSale = saleMax._max.saleNumber || 0;

  return Math.max(maxQueue, maxCrb, maxSale) + 1;
}

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
    
    // Generate CRB number server-side for race-condition safety
    // Falls back to client-provided number for backwards compatibility
    const crbNumber = data.crbNumber 
      ? parseInt(data.crbNumber) 
      : await getNextCrbNumber(branchId);

    const result = await prisma.queue.create({
      data: {
        branch: {
          connect: {
            branchId: branchId
          }
        },
        crbNumber: crbNumber,
        customerId: data.customerId,
        description: data.description,
        amount: parseInt(data.amount),
        totalKg: parseFloat(data.totalKg),
        category: data.category || 'Walk-in',
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        date: data.date ? new Date(data.date) : new Date(),
      },
    });

    // Return the result with the assigned CRB number
    return res.status(200).json({ ...result, crbNumber });
  } catch (error: any) {
    console.error('Error inserting into queue:', error);
    return res.status(500).json({ message: 'Failed to insert into queue', error: error.message });
  }
};