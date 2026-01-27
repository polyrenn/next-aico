import { prisma } from "../../../lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {
       const { id } = req.query
      const result = await prisma.tank.findMany({
        where: {
            branchId: parseInt(id)
            
        }
        
      });
      res.status(200).json(result);
  };