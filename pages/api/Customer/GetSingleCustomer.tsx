import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Customer/GetSingleCustomer:
 *   get:
 *     summary: Returns a single customer
 *     parameters:
 *       - in: query
 *         name: uniqueid
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the customer to retrieve
 *     responses:
 *       200:
 *         description: The customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
export default async (req:any, res:any) => {
    const { uniqueid } = req.query
    const result = await prisma.$queryRaw`SELECT cs.name, cs.phone, cs.branch_id, cs.purchase_count,
    (select sum(total_kg) as total_kg from sales ts where ts.customer_id = ${uniqueid}
    ),
    (select cast(sum(amount) as float) as total_amount from sales ts where ts.customer_id = ${uniqueid}
    ),
    (select cast(timestamp as timestamp) as first_purchase from sales ts where ts.customer_id = ${uniqueid}
     order by id asc limit 1
    ),
    (select cast(timestamp as timestamp) as last_purchase from sales ts where ts.customer_id = ${uniqueid}
     order by id desc limit 1
    )
    From customers cs
    Where cs.unique_id = ${uniqueid}
    `
      res.status(200).json(result);
  };