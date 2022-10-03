import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { id } = req.query
    //Under Seperate Customer Objects
    const result = await prisma.queue.findFirst({
        where: {
            id: parseInt(id)
        },
        
      });
// Lost type saftey with query raw
    /*
    const result = await prisma.$queryRaw`SELECT queue.*, customer.name, customer.phone
    FROM queue
    RIGHT JOIN customer
         ON queue.customer_id = customer.unique_id
    WHERE queue.id = ${parseInt(id)};`  
    */
      res.status(200).json([result]);
  };