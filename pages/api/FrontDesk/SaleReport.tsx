import { prisma } from "../../../lib/prisma";
/*
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});
*/
export default async (req: any, res: any) => {

  const { branch } = req.query  
  const today = new Date().toISOString()
  const formattedDate = today.split('T')[0]    
  const result = await prisma.prices.findMany({
    where: {
      branchId: parseInt(branch),
    },
    orderBy: {
        id: 'asc'
    }
  });

  let resultQuery = [] as any;

  const aggregate = result.map(async (item) => {
    let data = await prisma.$queryRaw`
      SELECT 
      SUM(amount) FILTER (WHERE category = ${item.category}) AS total_${item.category}_sold
      From sales s
      Where s.branch_id = 131313
    `;
  });

  const getWithForOf = async() => {
    const data = []
    // Un HardCodeBranch
    for (const item of result) {
      let aggregated = await prisma.$queryRawUnsafe(`
      SELECT 
      (select cast(count(*) as float) from sales s where category = '${item.category}'
        and timestamp::date =  date '${formattedDate}'
        and s.branch_id = ${branch}
      ),
      CAST(SUM(total_kg) FILTER (WHERE category = '${item.category}') AS FLOAT) AS total_kg_sold,
      CAST(SUM(amount) FILTER (WHERE category = '${item.category}') AS FLOAT) AS total_amount_sold
      From sales s
      Where s.branch_id = ${branch}
      and timestamp::date =  date '${formattedDate}'
      `);
      let [destructured] = aggregated as any
      let formatted = {
        category: item.category,
        ...destructured
      }
      data.push(formatted)
    }
    return data
 }
 const returned = await getWithForOf()

  res.status(200).json(returned);
};

/*
let query = await prisma.$queryRaw`
    SELECT 
    SUM(amount) FILTER (WHERE category = ${item.category}) AS total_${item.category}_sold
    From sales s
    Where s.branch_id = 131313
  `;

*/
