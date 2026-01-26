import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Stock/NewStock:
 *   post:
 *     summary: Creates a new stock
 *     parameters:
 *       - in: query
 *         name: tankId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tank
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
 *             $ref: '#/components/schemas/Stock'
 *     responses:
 *       200:
 *         description: The created stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 */
export default async (req, res) => {
    let data = req.body;
    const { tankId, branch } = req.query
    data = JSON.parse(data);
      const result = await prisma.stock.create({
        data: {
          kg: data.kg,
          value: data.value,
          loadNumber: data.loadNumber,
          date: data.date,
          branch: {
            connect: { branchId: parseInt(branch) },
          },
          tank: {
            connect: { tankId: tankId },
          },
        },
        
      });

      const tank = await prisma.tank.update({
        where: {
            tankId: tankId,
          },
          data: {
            amount: data.kg,
          },
      });


      res.status(200).json(result);
  };