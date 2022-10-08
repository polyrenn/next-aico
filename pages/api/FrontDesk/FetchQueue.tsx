import { prisma } from '../../../lib/prisma';


export default async (req:any, res:any) => {
    let data = req.body;
    const { id } = req.query
    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]
    //Eventually Include Branch
      const result = await prisma.queue.findMany({
        where: {
          branchId: parseInt(id),

            timestamp: {
                gte:  new Date(`${formattedDate}`),
            }

           
            
        }
        
      });
      res.status(200).json(result);
  };