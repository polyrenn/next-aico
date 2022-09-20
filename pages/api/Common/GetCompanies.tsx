import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
      const result = await prisma.company.findMany({
        select: {
            name: true,
            companyId: true,
          },
        
      });
      res.status(200).json(result);
  };