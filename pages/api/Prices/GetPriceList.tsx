import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Prices/GetPriceList:
 *   get:
 *     summary: Returns the price list for a branch
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: The price list for the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prices'
 */
export default async (req, res) => {
    const { branch } = req.query
      const result = await prisma.prices.findMany({
       where: {
        branchId: parseInt(branch)
       },
       orderBy: [
        {
          id: 'asc',
        },
      ],
        
      });


      res.status(200).json(result);
  };