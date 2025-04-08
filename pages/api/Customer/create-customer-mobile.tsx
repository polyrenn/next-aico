import { NextApiRequest } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req:NextApiRequest, res) => {
    let data = req.body;
      const result = await prisma.customer.create({
        data: {
          ...data
        },
        
      });
      res.status(200).json(result);
  };