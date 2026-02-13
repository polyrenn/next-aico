import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
// Removed unused imports: uuidv4, dayjs, Session

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { branch: branchQuery } = req.query;

  if (!branchQuery || typeof branchQuery !== 'string') {
    return res.status(400).json({ message: "Branch query parameter is required and must be a string." });
  }

  const branchId = parseInt(branchQuery, 10);
  const today = new Date().toISOString()
  const formattedDate = today.split('T')[0]

  if (isNaN(branchId)) {
    return res.status(400).json({ message: "Invalid branch ID provided." });
  }

  try {
    // Query MAX across all three tables in parallel for accurate next number
    const todayStart = new Date(`${formattedDate}T00:00:00.000Z`);
    
    const [queueMax, crbMax, saleMax] = await Promise.all([
      // Check Queue table (pending online orders)
      prisma.queue.aggregate({
        _max: { crbNumber: true },
        where: {
          branchId: branchId,
          timestamp: { gte: todayStart },
        },
      }),
      // Check CRB table (active invoices)
      prisma.crb.aggregate({
        _max: { crbNumber: true },
        where: {
          branchId: branchId,
          timestamp: { gte: todayStart },
        },
      }),
      // Check Sale table (completed sales, excluding Switch records)
      prisma.sale.aggregate({
        _max: { saleNumber: true },
        where: {
          branchId: branchId,
          timestamp: { gte: todayStart },
          category: { not: 'Switch' },
        },
      }),
    ]);

    // Get the highest number across all tables
    const maxQueue = queueMax._max.crbNumber || 0;
    const maxCrb = crbMax._max.crbNumber || 0;
    const maxSale = saleMax._max.saleNumber || 0;
    
    const highestNumber = Math.max(maxQueue, maxCrb, maxSale);
    const nextCrbNumber = highestNumber + 1;

    // Return the next number
    res.status(200).json({ nextCrbNumber });

  } catch (error) {
    console.error("Error fetching next CRB number:", error);
    // Provide a generic error message to the client
    res.status(500).json({ message: 'Failed to fetch next CRB number due to an internal error.' });
  } finally {
    // Ensure Prisma client is disconnected (optional, depends on setup)
    // await prisma.$disconnect();
  }
}
