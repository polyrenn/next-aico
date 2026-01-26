import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/CreateCompany:
 *   post:
 *     summary: Creates a new company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: The created company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    data = JSON.parse(data);
      const result = await prisma.company.create({
        data: {
          ...data,
        },
        
      });
      res.status(200).json(result);
  };