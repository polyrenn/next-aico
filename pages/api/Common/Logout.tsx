import { withSessionRoute } from "../../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/Common/Logout:
 *   get:
 *     summary: Logs the user out
 *     responses:
 *       200:
 *         description: A message indicating that the user has been logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged Out
 */
export default withSessionRoute(loginRoute);

async function loginRoute(req:NextApiRequest, res:NextApiResponse) {
  await req.session.destroy();
  res.send({ message: 'Logged Out' });
}