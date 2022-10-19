import { withSessionRoute } from "../../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
export default withSessionRoute(loginRoute);

async function loginRoute(req:NextApiRequest, res:NextApiResponse) {
  await req.session.destroy();
  res.send({ message: 'Logged Out' });
}