import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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