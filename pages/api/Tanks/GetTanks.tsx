import { prisma } from "../../../lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/Tanks/GetTanks:
 *   get:
 *     summary: Returns a list of tanks for a given branch
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: A list of tanks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tank'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
       const { id } = req.query
      const result = await prisma.tank.findMany({
        where: {
            branchId: parseInt(id)
            
        }
        
      });
      res.status(200).json(result);
  };