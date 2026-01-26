import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/Customer/IsRegistered:
 *   get:
 *     summary: Checks if a customer is registered
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the customer to check
 *     responses:
 *       200:
 *         description: The customer if they are registered, otherwise null
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
export default async (req:NextApiRequest, res:NextApiResponse) => {
    const {id}  = req.query
    const result = await prisma.customer.findFirst({
        where: {
            uniqueId: id
        },
        select: {
          name: true,
          branchId: true,
          phone: true,
          uniqueId: true,
          customerType: true,
          change: true
        },
      });
      res.status(200).json(result);
  };