import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    const { category:cat, branch:bran } = req.query
      const result = await prisma.prices.deleteMany({
        where: {
            category: cat,
            branchId: parseInt(bran)
        },
 
      });
      res.status(200).json(result);
  };