import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
     const { id } = req.query;
      const result = await prisma.branch.delete({
        where: {
            branchId: parseInt(id)
        }
      });
      res.status(200).json(result);
  };