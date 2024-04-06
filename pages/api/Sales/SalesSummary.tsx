import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

interface Sales {
    name: string;
    sale_number: number;
    total_kg: number;
    amount: number;
    customer_id: string;
    timestamp: string;
    change: number
}[]

export default async (req: any, res: any) => {

    const today = new Date().toISOString()   
    const { date } = req.query
    const formattedDate = date?.split('T')[0] 

const openingStock:any = await prisma.$queryRaw`SELECT b.id,
b.name,
(select ts.opening as opening_stock from sales ts where b.branch_id = ts.branch_id
    and ts.timestamp::date = ${formattedDate}::date
    order by id asc limit 1   
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const balanceStock:any = await prisma.$queryRaw`SELECT b.id,
b.name,
(select ts.closing as closing_stock from sales ts where b.branch_id = ts.branch_id
    and ts.category != 'Switch'
    and ts.timestamp::date = ${formattedDate}::date
    order by id desc limit 1   
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const branchDetails:any = await prisma.$queryRaw`SELECT b.id,
b.name,
b.current_tank,
(select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const summation:any = await prisma.$queryRaw`SELECT
(select cast(count(*) as float) as count_invoice from sales s where
  timestamp::date = ${formattedDate}::date
),
CAST(SUM(total_kg) AS FLOAT) AS total_kg_sold,
CAST(SUM(amount) FILTER (WHERE payment_method = 'cash') AS FLOAT) AS total_cash_sold,
CAST(SUM(amount) FILTER (WHERE payment_method = 'pos') AS FLOAT) AS total_pos_sold,
CAST(SUM(amount) AS FLOAT) AS total_amount_sold
From sales s
where timestamp::date= ${formattedDate}::date
`
const [formattedSummation] = summation

const data = {

    openingStock: [
        ...openingStock
    ],

    closingStock: [
        ...balanceStock
    ],

    currentTank: [
        ...branchDetails
    ],

    summation: formattedSummation
  };
  res.status(200).json(data);
};
