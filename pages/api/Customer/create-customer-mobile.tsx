import { NextApiRequest } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Customer/create-customer-mobile:
 *   post:
 *     summary: Creates a new customer from a mobile device
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
export default async (req:NextApiRequest, res) => {
    const { uniqueId, name, phone, branchId, date  } = req.body;
      const result = await prisma.customer.create({
        data: {
          name: name,
          phone: phone,
          uniqueId: uniqueId,
          date: date,
          branch: {
            connect: {
              branchId: branchId
            }
          }
        },
        
      });
      res.status(200).json(result);
  };