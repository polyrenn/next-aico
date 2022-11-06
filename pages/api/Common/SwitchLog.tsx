import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, date, branch } = req.query
    const today = new Date().toISOString()
    const formattedDate = today.split('T')[0]

    const result:any = await prisma.$queryRaw`
    SELECT s.*
    FROM switch_log s
    WHERE timestamp::date = ${date}::date
    
    `
  res.status(200).json(result);
};
