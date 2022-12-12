import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    const { branch } = req.query
    const result = await prisma.customer.findMany({
        where: {
          branchId: parseInt(branch)
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