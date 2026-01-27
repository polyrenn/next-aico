import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req:NextApiRequest, res:NextApiResponse) => {
      const result = await prisma.company.findMany({
        select: {
            name: true,
            companyId: true,
          },
        
      });
      res.status(200).json(result);
  };