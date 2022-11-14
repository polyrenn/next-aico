import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    const { uniqueid } = req.query
    const result = await prisma.customer.findFirst({
        where: {
            uniqueId: uniqueid
        },
        select: {
          name: true,
          branchId: true,
          phone: true,
          uniqueId: true,
          customerType: true,
          purchaseCount: true
        },
      });
      res.status(200).json(result);
  };