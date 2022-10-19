import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    let data = req.body;
    let { id, isreg, change, ischange, usechange, tank } = req.query
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

      //Update Change
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

      //Use Change
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


      //Increment Purcahse Count
      if(isreg == 'true') {
        const purchaseCount = await prisma.customer.update({
          where: {
            uniqueId: customerId,
          },
          data: {
            purchaseCount: {
              increment: 1
            }
          },
        
      });
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