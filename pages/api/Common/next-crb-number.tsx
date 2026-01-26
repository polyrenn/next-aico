import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
// Removed unused imports: uuidv4, dayjs, Session

/**
 * @swagger
 * /api/Common/next-crb-number:
 *   get:
 *     summary: Returns the next CRB number for a given branch
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: The next CRB number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextCrbNumber:
 *                   type: integer
 */
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
    // Find the maximum crbNumber for the given branch
    const maxCrbResult = await prisma.crb.aggregate({
      _max: {
        crbNumber: true,
      },
      where: {
        // Assuming the field in your prisma schema is 'branchId' and it's an Int
        // Adjust 'branchId' if your schema uses a different field name (e.g., 'branch')
        branchId: branchId,
        timestamp: {
          gte: new Date(`${formattedDate}`),
        },
      },
    });

    // Determine the next CRB number
    const maxCrb = maxCrbResult._max.crbNumber;
    const nextCrbNumber = maxCrb ? maxCrb + 1 : 1; // Start from 1 if no CRBs exist for the branch

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
