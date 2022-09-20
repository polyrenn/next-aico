import { prisma } from "../../../lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {
       const { id } = req.query
      const result = await prisma.$queryRaw
        `SELECT stock.*, tanks.designation
        FROM stock
        Left JOIN tanks
             ON stock.tank_id = tanks.tank_id
        Where stock.branch_id = ${parseInt(id)}     
      `;

      res.status(200).json(result);
  };