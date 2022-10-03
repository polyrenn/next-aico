import { prisma } from "../../../lib/prisma";

export default async (req, res) => {
    let data = req.body;
    const { branch, current } = req.query
      const result = await prisma.branch.update({
       where: {
        branchId: parseInt(branch)
       },
       data: {
        currentTank: current
      },
        
      });

      const aggregate = await prisma.$queryRaw`SELECT b.id,
      b.name, 
      (select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
           and timestamp > '2020-10-02'::timestamp
           and s.current_tank = 'Tank A'
      ),
      (select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
           and timestamp > '2020-10-02'::timestamp
           and s.current_tank = 'Tank A'
      ),
      (select cast(sum(s.amount) as float) as amount_sold from sales s where b.branch_id = s.branch_id
           and timestamp > '2022-10-02'::timestamp
           and s.current_tank = 'Tank A'
      ),
      companies.name as company_name
      FROM branches b
      Left JOIN companies
      ON b.company_id = companies.company_id
      ORDER BY b.id asc 
      `;

     const [aggResults] = aggregate as any 

    console.log(aggResults) 
    const switchLog = await prisma.switchLog.create({
        data: {
          branchId: 131313,
          meta: aggResults,
          timestamp: new Date()
        }
    })  




      res.status(200).json(result);
  };