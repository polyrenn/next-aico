import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
     const { id } = req.query;
      const result = await prisma.company.delete({
        where: {
            companyId: parseInt(id)
        }
      });
      res.status(200).json(result);
  };