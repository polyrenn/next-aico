import { withSessionRoute } from "../../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/Login:
 *   post:
 *     summary: Logs a user in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The logged in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to load data
 */
export default withSessionRoute(loginRoute);

async function loginRoute(req:any, res:any) {
  // get user from database then:
  
  const {username, password} = req.body
  const data = JSON.parse(req.body)
  try {
    const result = await prisma.staff.findFirstOrThrow({
        where: {
            username: data.username
        },
        select: {
            username: true,
            branchId: true,
            companyID: true,
            role: true,
            password: true
          },
        
      });

      

      const userPassoword = result.password
      const pass = req.body.username
      if(userPassoword === data.password) {
        req.session.user = {
            id: 230,
            admin: true,
            username: result.username,
            branch: result.branchId, // Staff Branch Id
            company: result.companyID,
            role: result.role
          };
          await req.session.save();
          res.status(200).json(req.session.user);
      } else {
        res.status(401).send("Unauthorized!")
      }


     
  } catch (e) {
    res.status(500).json({ error: 'failed to load data' })
  }
   
   
  
}