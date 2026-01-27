import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    data = JSON.parse(data);
      const result = await prisma.company.create({
        data: {
          ...data,
        },
        
      });
      res.status(200).json(result);
  };