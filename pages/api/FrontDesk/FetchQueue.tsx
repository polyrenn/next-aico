import { prisma } from '../../../lib/prisma';


export default async (req, res) => {
    let data = req.body;
    const { id } = req.query
    //Eventually Include Branch
      const result = await prisma.queue.findMany({
        where: {
            timestamp: {
                gte: new Date("2022-08-28"),
            },
            
        }
        
      });
      res.status(200).json(result);
  };