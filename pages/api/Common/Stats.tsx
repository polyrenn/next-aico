import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]  
  const branchAggregations = await prisma.$queryRaw`SELECT b.id,
b.name,
b.current_tank,
(select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
     and timestamp > ${formattedDate}::timestamp
),
(select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id),
(select cs.opening as opening_stock from sales cs where b.branch_id = cs.branch_id
     and timestamp > ${formattedDate}::timestamp
     order by id asc limit 1   
),
(select ts.amount as balance_stock from tanks ts where b.current_tank = ts.tank_id),
(select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
   and timestamp > ${formattedDate}::timestamp
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id 
WHERE b.branch_id = ${id}::float 
ORDER BY b.id asc 


`;

  // res.send(branches)
  res.status(200).json(branchAggregations);
};
