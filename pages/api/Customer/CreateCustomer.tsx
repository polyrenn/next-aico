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
    let data = req.body;
    data = JSON.parse(data);
      const result = await prisma.customer.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: 131313 },
          },
        },
        
      });
      res.status(200).json(result);
  };