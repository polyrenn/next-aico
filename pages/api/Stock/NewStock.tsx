import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { tankId, branch } = req.query
    data = JSON.parse(data);
      const result = await prisma.stock.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: parseInt(branch) },
          },
          tank: {
            connect: { tankId: tankId },
          },
        },
        
      });

      const tank = await prisma.tank.update({
        where: {
            tankId: tankId,
          },
          data: {
            amount: data.kg,
          },
      });


      res.status(200).json(result);
  };