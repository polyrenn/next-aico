import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Customer/GetCustomers:
 *   get:
 *     summary: Returns a list of customers
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
export default async (req:any, res:any) => {
    const { branch } = req.query
    const result = await prisma.customer.findMany({
        where: {
          branchId: parseInt(branch)
        },
        select: {
          name: true,
          branchId: true,
          phone: true,
          uniqueId: true,
          customerType: true,
          purchaseCount: true
        },
      });
      res.status(200).json(result);

  };