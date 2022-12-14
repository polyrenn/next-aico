import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, date, branch } = req.query
    const today = new Date().toISOString()
    const formattedDate = date?.split('T')[0]

    const didSwitch:any = await prisma.$queryRaw`
    SELECT * FROM switch_log 
    WHERE timestamp::date = ${date}::date
    `

    let result:any
    if(didSwitch.length == 0) {
        result = await prisma.$queryRaw`
        SELECT b.id,
        b.name,
        b.current_tank,
        (select st.load_number from stock st where b.branch_id = st.branch_id
        order by id desc
        limit 1
        ),
        (select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
            and s.category != 'Switch'
            and timestamp::date = ${date}::date
        ),
        (select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id),
        (select cs.opening as opening_stock from sales cs where b.branch_id = cs.branch_id
            and timestamp::date = ${date}::date
            order by id asc limit 1   
        ),
        (select cs.current_tank as current_desig from sales cs where b.branch_id = cs.branch_id
            and timestamp::date = ${date}::date
            order by id desc limit 1   
        ),
        (select cs.closing as closing_stock from sales cs where b.branch_id = cs.branch_id
            and timestamp::date = ${date}::date
            order by id desc limit 1   
        ),
        (select ts.amount as balance_stock from tanks ts where b.current_tank = ts.tank_id),
        (select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
        and timestamp::date = ${date}::date
        ),
        companies.name as company_name
        FROM branches b
        Left JOIN companies
        ON b.company_id = companies.company_id 
        WHERE b.branch_id = ${parseInt(branch)}
        ORDER BY b.id asc 
        
        `
        
        
    } else {
        result = await prisma.$queryRaw`
        SELECT b.id,
        b.name,
        b.current_tank,
        (select st.load_number from stock st where b.branch_id = st.branch_id
        order by id desc
        limit 1
        ),
        (select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
            and s.category != 'Switch'
            and timestamp::date = ${date}::date
        ),
        (select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id),
        (select meta->0->'opening_new' as opening_stock from switch_log cs where b.branch_id = cs.branch_id
            and timestamp::date = ${formattedDate}::date
            order by id desc limit 1   
        ),
        (select cs.current_tank as current_desig from sales cs where b.branch_id = cs.branch_id
            and timestamp::date = ${date}::date
            order by id desc limit 1   
        ),
        (select cs.closing as closing_stock from sales cs where b.branch_id = cs.branch_id
            and timestamp::date = ${date}::date
            order by id desc limit 1   
        ),
        (select ts.amount as balance_stock from tanks ts where b.current_tank = ts.tank_id),
        (select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
        and timestamp::date = ${date}::date
        ),
        companies.name as company_name
        FROM branches b
        Left JOIN companies
        ON b.company_id = companies.company_id 
        WHERE b.branch_id = ${parseInt(branch)}
        ORDER BY b.id asc 
        `
    }
   
     console.log(result)
     res.status(200).json(result);
};
