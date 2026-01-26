import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Tanks/CreateTank:
 *   post:
 *     summary: Creates a new tank
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
 *             $ref: '#/components/schemas/Tank'
 *     responses:
 *       200:
 *         description: The created tank
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tank'
 */
export default async (req, res) => {
  let data = req.body;
  const { branch } = req.query;
  data = JSON.parse(data);

  const updateTank = await prisma.branch.updateMany({
    where: { 
      branchId: parseInt(branch),
    },

    data: {
      currentTank: data.tankId
    }
});

  const result = await prisma.tank.create({
    data: {
      ...data,
      branch: {
        connect: { branchId: parseInt(branch) },
      },
    },
  });

  res.status(200).json(result);
};
