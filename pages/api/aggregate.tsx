import { PrismaClient, Branch } from '@prisma/client';
const prisma = new PrismaClient(
    {
        log: [
            {
              emit: 'event',
              level: 'query',
            },
            {
              emit: 'stdout',
              level: 'error',
            },
            {
              emit: 'stdout',
              level: 'info',
            },
            {
              emit: 'stdout',
              level: 'warn',
            },
          ],
    }
);

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  })

import { NextApiRequest, NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {

    const branches = await prisma.branch.findMany({

    })
    branches.map( async (item:Branch) => {
        const declinedAggregation = await prisma.declinedSales.aggregate({
            _count: true 
        });
    
        const queueAggregation = await prisma.queue.aggregate({
            _count: true,
            where: {
                branchId: item.branchId
            } 
        });
    })
    //Declined Sales Count

    const branchAggregations = await prisma.$queryRaw
`SELECT b.id,
b.name, 
(select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
     and timestamp > '2022-09-26T18:21:57+00:00'
),
(select cast(count(*) as integer) as queue_count from queue q where b.branch_id = q.branch_id
     and timestamp > '2022-09-20T18:21:57+00:00'
),
(select cast(count(*) as integer) as declined_count from declined_sales d where b.branch_id = d.branch_id),
(select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
   and timestamp > '2022-09-26T18:21:57+00:00'
),
(select cast(sum(s.amount) as float) as amount_sold from sales s where b.branch_id = s.branch_id),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 

`;
    

   
     // res.send(branches)
      res.status(200).json(branchAggregations);
  };

  /*

  SELECT branches.id, branches.name, companies.name as company,
SUM(sales.total_kg) as total_kg,
SUM (sales.amount) as amount,
COUNT(sales.id) as sales_count 
        FROM branches
        Right JOIN companies      
              ON branches.company_id = companies.company_id   
        right JOIN sales
             ON branches.branch_id = sales.branch_id
        WHERE sales.timestamp > '2022-09-26T14:30:58+00:00'     
        GROUP BY branches.id, branches.name, companies.name     
*/