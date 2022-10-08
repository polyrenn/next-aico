import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
  let data = req.body;
  const { branch } = req.query;
  data = JSON.parse(data);

  const updateTank = await prisma.branch.updateMany({
    where: { 
      branchId: parseInt(branch),
    },

    data: {
      currentTank: data.tankId
    }
});

  const result = await prisma.tank.create({
    data: {
      ...data,
      branch: {
        connect: { branchId: parseInt(branch) },
      },
    },
  });

  res.status(200).json(result);
};
