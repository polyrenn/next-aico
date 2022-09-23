import { withSessionRoute } from "../../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
export default withSessionRoute(loginRoute);

async function loginRoute(req:any, res:any) {
  // get user from database then:
  
  const { username } = req.query
  try {
    const result = await prisma.staff.findFirstOrThrow({
        where: {
            username: username
        },
        select: {
            username: true,
            branchId: true,
          },
        
      });
      req.session.user = {
        id: 230,
        admin: true,
        branch: 141414 // Staff Branch Id
      };
      await req.session.save();
      res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: 'failed to load data' })
  }
   
   
  
}