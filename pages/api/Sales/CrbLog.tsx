import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

interface Sales {
  name: string;
  sale_number: number;
  total_kg: number;
  amount: number;
  customer_id: string;
  timestamp: string;
  change: number;
}
[];

export default async (req: any, res: any) => {
  const today = new Date().toISOString();
  const { date } = req.query;
  const { branch } = req.query;
  const formattedDate = date?.split("T")[0];
  const formattedToday = today.split("T")[0]
  let result:any
  if(date == '' && branch == '') {
    result = await prisma.$queryRaw`
    SELECT * from crbs cs
    Where cs.timestamp::date = ${formattedToday}::date
    `
  } else {
    result = await prisma.$queryRaw`SELECT cs.*, 
    cus.name, cus.phone
    From crbs cs
    Left Join customers cus
    On cs.customer_id = cus.unique_id
    Where cs.timestamp::date = ${formattedDate}::date
    and cs.branch_id = ${parseInt(branch)}::int
    order by cs.timestamp asc
    `
  }

  let aggregations:any
  if(branch == '') {
    aggregations = null
  } else {
    aggregations = await prisma.$queryRaw`SELECT cast(sum(amount) as float) as total_amount_sold,
    (select cast(sum(cs.total_kg) as float) as total_kg_sold from crbs cs where cs.timestamp::date = ${formattedDate}::date
    and cs.branch_id = ${parseInt(branch)}::integer
    )
    From crbs cs
    Where cs.timestamp::date = ${formattedDate}::date
    and cs.branch_id = ${parseInt(branch)}::int
    `
  }

  const formattedResult = {
    crbLog: [
        ...result
    ],
    aggregations: [
        ...aggregations
    ]
  }


  
  res.status(200).json(formattedResult);
};
