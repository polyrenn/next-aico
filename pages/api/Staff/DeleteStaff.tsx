import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
     const { username } = req.query;
      const result = await prisma.staff.delete({
        where: {
            username: username
        }
      });
      res.status(200).json(result);
  };