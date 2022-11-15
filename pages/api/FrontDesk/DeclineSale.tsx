import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    let data = req.body;
    data = JSON.parse(data);
    const result = await prisma.declinedSales.create({
      data: {
        ...data
      }
    })
      res.status(200).json(result);
  };