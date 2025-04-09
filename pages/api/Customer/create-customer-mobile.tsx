import { NextApiRequest } from "next";
import { prisma } from "../../../lib/prisma";

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