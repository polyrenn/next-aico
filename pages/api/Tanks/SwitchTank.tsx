import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { branch, current } = req.query
      const result = await prisma.branch.update({
       where: {
        branchId: parseInt(branch)
       },
       data: {
        currentTank: current
      },
        
      });


      res.status(200).json(result);
  };