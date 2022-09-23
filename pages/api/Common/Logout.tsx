import { withSessionRoute } from "../../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
export default withSessionRoute(loginRoute);

async function loginRoute(req:NextApiRequest, res:NextApiResponse) {
  // get user from database then:
  await req.session.destroy();
  res.send("Logged Out");
}