import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
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
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})



export default async (req, res) => {
  let data = req.body;
  const { branch, category } = req.query;
  data = JSON.parse(data);
  const tank = await prisma.prices.updateMany({
    where: {
        branchId: parseInt(branch),
        category: data.category
      },
      data: {
        pricePerKg: data.pricePerKg,
      },
  });


  res.status(200).json(tank);
};
