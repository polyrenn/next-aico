//import { prisma } from "../../../lib/prisma";
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

export default async (req: any, res: any) => {
  const result = await prisma.prices.findMany({
    where: {
      branchId: 131313,
    },
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
    for (const item of result) {
      let dataUser = await prisma.$queryRawUnsafe(`
      SELECT 
      CAST(SUM(amount) FILTER (WHERE category = '${item.category}') AS FLOAT) AS total_sold
      From sales s
      Where s.branch_id = 131313
      `);
      data.push(dataUser);
      console.log(dataUser)
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
