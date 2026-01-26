import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Prices/GetCategories:
 *   get:
 *     summary: Returns a list of price categories for a branch
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: A list of price categories
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
        branchId: parseInt(branch as string)
       }
        
      });


      res.status(200).json(result);
  };