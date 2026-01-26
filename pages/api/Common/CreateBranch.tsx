import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/CreateBranch:
 *   post:
 *     summary: Creates a new branch
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: The created branch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    const { id } = req.query
    data = JSON.parse(data);
      const result = await prisma.branch.create({
        data: {
          ...data,
          company: {
            connect: { companyId: parseInt(id) },
          },
        },
        
      });
      res.status(200).json(result);
  };