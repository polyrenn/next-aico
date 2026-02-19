import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

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

    // Generate a queue-local daily counter (separate from CRB/sale numbering).
    // Queue numbers do NOT consume real CRB numbers — those are assigned
    // when the cashier processes the order via insert-crb-mobile.
    const result = await prisma.$transaction(async (tx) => {
      // Lock on a different key than CRB (offset by 1,000,000 to avoid collision)
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${branchId + 1000000})`;

      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const todayStart = new Date(`${formattedDate}T00:00:00.000Z`);

      const queueMax = await tx.queue.aggregate({
        _max: { crbNumber: true },
        where: { branchId, timestamp: { gte: todayStart } },
      });

      const queueNumber = (queueMax._max.crbNumber || 0) + 1;

      const queueItem = await tx.queue.create({
        data: {
          branch: { connect: { branchId } },
          crbNumber: queueNumber,
          customerId: data.customerId,
          description: data.description,
          amount: parseInt(data.amount),
          totalKg: parseFloat(data.totalKg),
          category: data.category || 'Walk-in',
          timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          date: data.date ? new Date(data.date) : new Date(),
        },
      });

      return { ...queueItem, queueNumber };
    });

    // Return queueNumber (not crbNumber — that's assigned when the cashier processes it)
    return res.status(200).json({ ...result, queueNumber: result.queueNumber });
  } catch (error: any) {
    console.error('Error inserting into queue:', error);
    return res.status(500).json({ message: 'Failed to insert into queue', error: error.message });
  }
};