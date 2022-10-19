import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    let data = req.body;
    const { branch } = req.query
    data = JSON.parse(data);
      const result = await prisma.prices.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: parseInt(branch) },
          },
        },
        
      });


      res.status(200).json(result);
  };