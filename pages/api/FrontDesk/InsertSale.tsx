import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    let { id, change, ischange, usechange, tank } = req.query
    data = JSON.parse(data);
    const customerId = data.customerId
    const branch = data.branch;
    const amount = data.amount
    
      const result = await prisma.sale.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: branch },
          },
        },
        
      });

      if(ischange == 'true') {
        const updateUser = await prisma.customer.update({
          where: {
            uniqueId: customerId,
          },
          data: {
            change: 
              parseInt(change)
          },
        })
      }

      if(usechange == 'true') {
        const updateChange = await prisma.customer.update({
          where: {
            uniqueId: customerId,
          },
          data: {
            change: 0
          },
        })
      }

      const updateTank = await prisma.tank.updateMany({
          where: { 
            branchId: branch,
            tankId: tank
          },

          data: {
            amount: {
              decrement: data.totalKg
            }
          }
      });

      
      res.status(200).json(result);
  };