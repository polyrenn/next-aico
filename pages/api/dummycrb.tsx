import { prisma } from "../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { id } = req.query
    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]
      const result = await prisma.crb.findFirst({
        where: {
            timestamp: {
              gte: new Date(`${formattedDate}`),
            },
        },

        orderBy: [
          {
            id: 'desc',
          },
        ],
        
      });
      res.status(200).json(result);
  };