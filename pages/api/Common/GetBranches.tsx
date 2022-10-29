import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req:NextApiRequest, res:NextApiResponse) => {
      const result = await prisma.branch.findMany({
        select: {
            name: true,
            address: true,
            branchId: true,
          },

          orderBy: {
            id: 'asc'
          }
        
      });
      res.status(200).json(result);
  };