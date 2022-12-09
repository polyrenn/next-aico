import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    const { branch } = req.query
    const result = await prisma.$queryRaw`SELECT cs.name, cs.phone, cs.branch_id, cs.purchase_count, cs.unique_id,
    (select sum(total_kg) as total_kg from sales ts where ts.customer_id = cs.unique_id
    ),
    (select cast(sum(amount) as float) as total_amount from sales ts where ts.customer_id = cs.unique_id
    ),
    (select cast(timestamp as timestamp) as first_purchase from sales ts where ts.customer_id = cs.unique_id
     order by id asc limit 1
    ),
    (select cast(timestamp as timestamp) as last_purchase from sales ts where ts.customer_id = cs.unique_id
     order by id desc limit 1
    )
    From customers cs
    `
      res.status(200).json(result);
  };