import { prisma } from "../../../lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/Stock/GetStocks:
 *   get:
 *     summary: Returns a list of stocks for a branch
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: A list of stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stock'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
       const { id } = req.query
      const result = await prisma.$queryRaw
        `SELECT stock.*, tanks.designation
        FROM stock
        Left JOIN tanks
             ON stock.tank_id = tanks.tank_id
        Where stock.branch_id = ${parseInt(id)}     
      `;

      res.status(200).json(result);
  };