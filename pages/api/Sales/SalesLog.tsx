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
    const { branch } = req.query
    const formattedDate = date?.split('T')[0] 
    console.log(formattedDate)

    const salesLog:any = await prisma.$queryRaw`SELECT s.*, 
    cs.name, cs.phone
    From sales s
    Left Join customers cs
    On s.customer_id = cs.unique_id
    Where s.timestamp::date = ${formattedDate}::date
    and s.branch_id = ${parseInt(branch)}::int
    order by s.timestamp asc
    `;

    const salesAggregations:any = await prisma.$queryRaw`SELECT
    (select ts.closing as closing_stock from sales ts
        Where ts.timestamp::date = ${formattedDate}::date
        and ts.branch_id = ${parseInt(branch)}::int
        order by id desc limit 1   
    ),
    cast(sum(s.total_kg) as float) as total_kg_today,
    cast(sum(s.amount) as float) as total_amount_today,
    cast(SUM(amount) FILTER (WHERE payment_method = 'pos') as float) AS total_pos_sold,
    cast(SUM(amount) FILTER (WHERE payment_method = 'cash') as float) AS total_cash_sold,
    cast(SUM(amount) FILTER (WHERE payment_method = 'transfer') as float) AS total_transfer_sold
    From sales s
    Where s.timestamp::date = ${formattedDate}::date
    and s.branch_id = ${parseInt(branch)}::int
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



    const formattedSales = salesLog.map((item:any) => ({
        timestampTime: new Date(item.timestamp).toLocaleTimeString("en-US", 
        {timeZone:'Africa/Lagos',hour12:true,hour:'numeric',minute:'numeric'}),
        ...item,
    }))

    const data = {
        sales: [
            ...formattedSales
        ],

        aggregations: [
            ...salesAggregations
        ]
    }
        

  res.status(200).json(data);
};


