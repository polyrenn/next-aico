import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/SwitchLog:
 *   get:
 *     summary: Returns the switch log for a given branch and date
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date to retrieve the switch log for
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: The switch log for the given branch and date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SwitchLog'
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, date, branch } = req.query
    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]

    const result:any = await prisma.$queryRaw`
    SELECT s.*
    FROM switch_log s
    WHERE timestamp::date = ${date}::date
    AND s.branch_id = ${parseInt(branch)}
    
    `
  res.status(200).json(result);
};
