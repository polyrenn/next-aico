import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req: any, res: any) => {
    const {id} = req.query

    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]  
  const branchDetails = await prisma.$queryRaw`SELECT b.id,
  b.name,
  b.current_tank,
  (select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id
  ),
  (select ts.amount as balance_stock from tanks ts where b.current_tank = ts.tank_id),
  (select ts.tank_id as other_tank from tanks ts where b.current_tank != ts.tank_id
   and ts.branch_id = ${parseInt(id)}
   limit 1
  ),
  (select ts.designation as other_desig from tanks ts where b.current_tank != ts.tank_id
   and ts.branch_id = ${parseInt(id)}
   limit 1
  ),
  companies.name as company_name
  FROM branches b
  Left JOIN companies
  ON b.company_id = companies.company_id
  WHERE b.branch_id = ${parseInt(id)}
  ORDER BY b.id asc   

`;

  // res.send(branches)
  res.status(200).json(branchDetails);
};
