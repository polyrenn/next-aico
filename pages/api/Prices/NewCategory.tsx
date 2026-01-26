import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Prices/NewCategory:
 *   post:
 *     summary: Creates a new price category
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prices'
 *     responses:
 *       200:
 *         description: The created price category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prices'
 */
export default async (req:any, res:any) => {
    let data = req.body;
    const { branch } = req.query
    data = JSON.parse(data);
      const result = await prisma.prices.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: parseInt(branch) },
          },
        },
        
      });


      res.status(200).json(result);
  };