import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
  const { branch } = req.query
    let data = req.body;
    data = JSON.parse(data);
      const result = await prisma.customer.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: parseInt(branch) }, // Use Session or Context Prop
          },
        },
        
      });
      res.status(200).json(result);
  };