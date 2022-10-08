import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    const { id } = req.query
    data = JSON.parse(data);
      const result = await prisma.branch.create({
        data: {
          ...data,
          company: {
            connect: { companyId: parseInt(id) },
          },
        },
        
      });
      res.status(200).json(result);
  };