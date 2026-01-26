import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/GetCompanies:
 *   get:
 *     summary: Returns a list of companies
 *     responses:
 *       200:
 *         description: A list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
      const result = await prisma.company.findMany({
        select: {
            name: true,
            companyId: true,
          },
        
      });
      res.status(200).json(result);
  };