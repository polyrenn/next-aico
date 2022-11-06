import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    let data = req.body;
    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]  
    const { branch, current, old, newname } = req.query

    const aggregate:any = await prisma.$queryRaw`SELECT b.id,
    b.name,
    b.current_tank,
    (select ts.amount as loss from tanks ts where b.current_tank = ts.tank_id),
    (select ts.designation as old_name from tanks ts where b.current_tank = ts.tank_id),
    (select ts.amount as opening_new from tanks ts where ts.tank_id = ${current}),
    (select cs.opening as opening_old from sales cs where b.branch_id = cs.branch_id
     and timestamp > ${formattedDate}::timestamp
     order by id asc limit 1   
     ),
    (select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
         and timestamp > ${formattedDate}::timestamp
         and s.current_tank = ${old}
    ),
    (select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
         and timestamp > ${formattedDate}::timestamp
         and s.current_tank = ${old}
    ),
    (select cast(sum(s.amount) as float) as amount_sold from sales s where b.branch_id = s.branch_id
         and timestamp > ${formattedDate}::timestamp
         and s.current_tank = ${old}
    ),
    companies.name as company_name
    FROM branches b
    Left JOIN companies
    ON b.company_id = companies.company_id
    WHERE b.branch_id = ${parseInt(branch)}
    ORDER BY b.id asc 
    `;

      const result = await prisma.branch.update({
       where: {
        branchId: parseInt(branch)
       },
       data: {
        currentTank: current
      },
        
      });

     

     const [aggResults] = aggregate as any 

    const formattedAggregations = aggregate.map((item:any) => ({
          switchedTo: newname,
          ...item
    })
    ) 
    const switchLog = await prisma.switchLog.create({
        data: {
          branchId: parseInt(branch),
          meta: formattedAggregations,
          timestamp: new Date()
        }
    })
    
    //Insert into sales 

    const switchSale = await prisma.sale.create({
     data: {
          branch: {
               connect: { branchId: parseInt(branch) },
          },
       description: formattedAggregations,
       timestamp: new Date(),
       amount: 0,
       category: "Switch",
       opening: 0,
       closing: 0,
       balance: 0,
       saleNumber: 0,
       paymentMethod: "",
       narrative: "Successful",
       change: 0,
       customerId: "Switcher",
       currentTank: newname
     }
     })
 




      res.status(200).json(result);
  };