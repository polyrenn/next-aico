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
    console.log(formattedDate)
 
let openingSales:Sales[] = await prisma.$queryRaw`SELECT DISTINCT b.name,
(select ts.sale_number from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id asc limit 1   
),
(select ts.total_kg from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id asc limit 1   
),
(select ts.customer_id from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id asc limit 1   
),
(select ts.amount from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id asc limit 1   
),
(select ts.timestamp from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id asc limit 1   
),
(select ts.change from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id asc limit 1   
)
From branches b



`; // Refactor to Swr  

let closingSales:Sales[] = await prisma.$queryRaw`SELECT DISTINCT b.name,
(select ts.sale_number from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id desc limit 1   
),
(select ts.total_kg from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id desc limit 1   
),
(select ts.customer_id from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id desc limit 1   
),
(select ts.amount from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id desc limit 1   
),
(select ts.timestamp from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id desc limit 1   
),
(select ts.change from sales ts where b.branch_id = ts.branch_id
     and ts.timestamp::date = ${formattedDate}::date
     order by id desc limit 1   
)
From branches b

`; // Refactor to Swr  

const salesAggregations:any = await prisma.$queryRaw`SELECT b.id,
b.name, 
(select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
    and s.timestamp::date = ${formattedDate}::date
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const totalKg:any = await prisma.$queryRaw`SELECT b.id,
b.name, 
(select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
    and s.timestamp::date = ${formattedDate}::date
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const totalAmount:any = await prisma.$queryRaw`SELECT b.id,
b.name, 
(select cast(sum(s.amount) as float) as amount_sold from sales s where b.branch_id = s.branch_id
    and s.timestamp::date = ${formattedDate}::date
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const totalCash:any = await prisma.$queryRaw`SELECT b.id,
b.name, 
(select cast(sum(s.amount) as float) as total_cash_amount from sales s where b.branch_id = s.branch_id
     and s.timestamp::date = ${formattedDate}::date
     and s.payment_method = 'cash'
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

const totalPos:any = await prisma.$queryRaw`SELECT b.id,
b.name, 
(select cast(sum(s.amount) as float) as total_pos_amount from sales s where b.branch_id = s.branch_id
     and s.timestamp::date = ${formattedDate}::date
     and s.payment_method = 'pos'
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`;

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




const formattedOpeningSales = openingSales.map(item => ({
    timestampTime: new Date(item.timestamp).toLocaleTimeString("en-US", {timeZone:'Africa/Lagos',hour12:true,hour:'numeric',minute:'numeric'}),
    ...item
}))

const formattedClosingSales = closingSales.map(item => ({
    timestampTime: new Date(item.timestamp).toLocaleTimeString("en-US", {timeZone:'Africa/Lagos',hour12:true,hour:'numeric',minute:'numeric'}),
    ...item
}))

const data = {
    openingSales: [
       ...formattedOpeningSales
    ],

    closingSales: [
        ...formattedClosingSales
    ],

    totalInvoice: [
        ...salesAggregations
    ],

    totalKg: [
        ...totalKg
    ],

    totalCash: [
        ...totalCash
    ],

    totalPos: [
        ...totalPos
    ],

    totalAmount: [
        ...totalAmount
    ],

    openingStock: [
        ...openingStock
    ],

    closingStock: [
        ...balanceStock
    ],

    currentTank: [
        ...branchDetails
    ]
  };
  res.status(200).json(data);
};
