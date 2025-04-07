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
 
let openingSales:Sales[] = await prisma.$queryRaw`SELECT b.name,
    ts.sale_number,
    ts.total_kg,
    ts.customer_id,
    ts.amount,
    ts.timestamp,
    ts.change
    FROM branches b
    LEFT JOIN (
    SELECT branch_id,
        id AS min_id,
        sale_number,
        total_kg,
        customer_id,
        amount,
        timestamp,
        change,
        ROW_NUMBER() OVER (PARTITION BY branch_id ORDER BY id) AS row_num
    FROM sales
    WHERE timestamp::date = ${formattedDate}::date
    AND category != 'Switch'
    ) ts ON b.branch_id = ts.branch_id
    WHERE ts.row_num = 1
    ORDER BY b.branch_id;




`; // Refactor to Swr  

let closingSales:Sales[] = await prisma.$queryRaw`SELECT DISTINCT ON (b.branch_id) 
b.name,
ts.sale_number,
ts.total_kg,
ts.customer_id,
ts.amount,
ts.timestamp,
ts.change
FROM branches b
LEFT JOIN (
SELECT branch_id,
    id AS sale_id,
    sale_number,
    total_kg,
    customer_id,
    amount,
    timestamp,
    change
FROM sales
WHERE timestamp::date = ${formattedDate}::date
AND category != 'Switch'
ORDER BY branch_id, timestamp DESC 
) ts ON b.branch_id = ts.branch_id
ORDER BY b.branch_id; 


`; // Refactor to Swr  

let totals:any = await prisma.$queryRaw`SELECT 
b.id,
b.name, 
CAST(SUM(s.total_kg) AS FLOAT) AS total_kg,
CAST(SUM(s.amount) AS FLOAT) AS amount_sold,
CAST(SUM(CASE WHEN LOWER(s.payment_method) = 'cash' THEN s.amount ELSE 0 END) AS FLOAT) AS total_cash_amount,
CAST(SUM(CASE WHEN LOWER(s.payment_method) = 'pos' THEN s.amount ELSE 0 END) AS FLOAT) AS total_pos_amount,
CAST(COUNT(CASE WHEN s.category != 'Switch' THEN 1 END) AS integer) AS sales_count,
c.name AS company_name
FROM 
branches b
LEFT JOIN 
sales s ON b.branch_id = s.branch_id
    AND s.timestamp::date = ${formattedDate}::date
LEFT JOIN 
companies c ON b.company_id = c.company_id
GROUP BY 
b.id, b.name, c.name
ORDER BY 
b.id ASC;


`;

const [ formattedTotals ] = totals;

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

    totals: totals

  };
  res.status(200).json(data);
};
