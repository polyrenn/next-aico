import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    data = JSON.parse(data);
      const result = await prisma.customer.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: 131313 },
          },
        },
        
      });
      res.status(200).json(result);
  };