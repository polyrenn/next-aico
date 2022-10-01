import { PrismaClient } from '@prisma/client';
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

export default async (req, res) => {
  const data = req.body;
  try {
    const result = await prisma.prices.findMany({
      where: {
        branchId: 131313 // Context Fron Login
      },
  
      select: {
        category: true,
        pricePerKg: true,
        availableKgs: true
      }
    });
    res.status(200).json(result);
    console.log(req.query)
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured." });
  }
};