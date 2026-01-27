import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    const { branch } = req.query
    const result = await prisma.branch.findFirst({
        where: {
          branchId: parseInt(branch)
        },
        select: {
          name: true,
        },
      });
      res.status(200).json(result);
  };