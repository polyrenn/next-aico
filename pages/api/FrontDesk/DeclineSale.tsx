import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { id } = req.query
    data = JSON.parse(data);
    const branch = data.branch;
      const result = await prisma.declinedSales.create({
        data: {
          ...data,
        },
        
      });
      res.status(200).json(result);
  };