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
  let result
  if(date == '' && branch == '') {
    result = await prisma.$queryRaw`
    SELECT * from declined_sales ds
    Where ds.timestamp::date = ${formattedToday}::date
    `
  } else {
    result = await prisma.$queryRaw`
    SELECT * from declined_sales ds
    Where ds.timestamp::date = ${formattedDate}::date
    and ds.branch_id = ${parseInt(branch)}
    `
  }
  
  res.status(200).json(result);
};
