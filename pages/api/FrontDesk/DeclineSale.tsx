import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { id } = req.query
    data = JSON.parse(data);
    const branch = data.branch;
      const result = await prisma.declinedSales.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: branch },
          },

          
          customer: {
            connect: { uniqueId: '637MAN' }, // Sale Needs Customer Relation
          }, 
        },
        
      });
      res.status(200).json(result);
  };