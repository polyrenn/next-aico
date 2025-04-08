import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
      const result = await prisma.customer.create({
        data: {
          ...data
        },
        
      });
      res.status(200).json(result);
  };