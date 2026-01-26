import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/EditBranch:
 *   put:
 *     summary: Updates a branch
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: The updated branch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
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