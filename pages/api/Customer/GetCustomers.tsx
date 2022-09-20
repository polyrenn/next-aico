import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    const result = await prisma.customer.findMany({
        select: {
          name: true,
          branchId: true,
          phone: true,
          uniqueId: true
        },
      });
      res.status(200).json(result);
  };