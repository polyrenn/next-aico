import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  log: [
    {
    emit: 'event',
    level: 'query',
    },
    {
    emit: 'stdout',
    level: 'error',
    },
    {
    emit: 'stdout',
    level: 'info',
    },
    {
    emit: 'stdout',
    level: 'warn',
    },
],
});

/**
 * @swagger
 * /api/Prices/UpdatePrice:
 *   put:
 *     summary: Updates a price
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
 *         description: The updated price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prices'
 */
export default async (req, res) => {
  let data = req.body;
  const { branch, category } = req.query;
  data = JSON.parse(data);
  let snippedData;
  if(data?.availableKgs) {
    console.log("Hey")
    snippedData = {
      pricePerKg: data.pricePerKg,
      availableKgs: data.availableKgs
    }
  } else {
    console.log("Not Here");
    snippedData = {
      pricePerKg: data.pricePerKg,
    }
  }
  const tank = await prisma.prices.updateMany({
    where: {
        branchId: parseInt(branch),
        category: data.category
      },
      data: {
        ...snippedData
      },
  });


  res.status(200).json(tank);
};
