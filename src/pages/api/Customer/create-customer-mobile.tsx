import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { uniqueId, name, phone, branchId, date } = req.body;

  if (!uniqueId || !name || !phone || !branchId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if customer already exists by phone or uniqueId
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { phone: phone },
          { uniqueId: uniqueId }
        ]
      }
    });

    if (existingCustomer) {
      return res.status(409).json({ message: 'Customer with this phone or ID already exists' });
    }

    const result = await prisma.customer.create({
      data: {
        name: name,
        phone: phone,
        uniqueId: uniqueId,
        date: date ? new Date(date) : new Date(),
        branch: {
          connect: {
            branchId: parseInt(branchId)
          }
        },
        purchaseCount: 0,
        change: 0
      },
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};