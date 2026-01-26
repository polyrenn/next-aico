import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/Prices/DeleteCategory:
 *   delete:
 *     summary: Deletes a price category
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the category to delete
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: The deleted price category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prices'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    const { category:cat, branch:bran } = req.query
      const result = await prisma.prices.deleteMany({
        where: {
            category: cat,
            branchId: parseInt(bran)
        },
 
      });
      res.status(200).json(result);
  };