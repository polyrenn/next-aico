import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Customer/CreateCustomer:
 *   post:
 *     summary: Creates a new customer
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
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The created customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
export default async (req, res) => {
  const { branch } = req.query
    let data = req.body;
    data = JSON.parse(data);
      const result = await prisma.customer.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: parseInt(branch) }, // Use Session or Context Prop
          },
        },
        
      });
      res.status(200).json(result);
  };