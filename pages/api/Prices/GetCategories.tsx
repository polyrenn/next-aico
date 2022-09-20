import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    const { branch } = req.query
      const result = await prisma.prices.findMany({
       where: {
        branchId: parseInt(branch)
       }
        
      });


      res.status(200).json(result);
  };