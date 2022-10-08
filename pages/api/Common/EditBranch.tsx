import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    let data = req.body;
    const { id } = req.query
    data = JSON.parse(data);

    if(data.hasOwnProperty("name") && data.name != "") {
        const result = await prisma.branch.update({
            where: {
                branchId: parseInt(id)
            },
            data: {
                name: data.name
            },
            
          });
          res.status(200).json(result);
    }

    if(data.hasOwnProperty("name") && data.address != "") {
        const result = await prisma.branch.update({
            where: {
                branchId: parseInt(id)
            },
            data: {
                address: data.address
            },
            
          });
          res.status(200).json(result);
    }



      
     
  };