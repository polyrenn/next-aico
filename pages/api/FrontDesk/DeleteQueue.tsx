import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { id } = req.query
      const result = await prisma.queue.delete({
        where: {
            id: parseInt(id)
        }
        
      });
      res.status(200).json(result);
  };