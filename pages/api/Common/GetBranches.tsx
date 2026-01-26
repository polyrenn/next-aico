import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/GetBranches:
 *   get:
 *     summary: Returns a list of branches
 *     responses:
 *       200:
 *         description: A list of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
      const result = await prisma.branch.findMany({
        select: {
            name: true,
            address: true,
            branchId: true,
          },

          orderBy: {
            id: 'asc'
          }
        
      });
      res.status(200).json(result);
  };