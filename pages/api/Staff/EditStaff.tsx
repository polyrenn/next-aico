import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
     const { username } = req.query;
     let data = req.body;
     data = JSON.parse(data);
      const result = await prisma.staff.update({
        where: {
            username: username
        },
        data: {
            password: data.password
        }
      });
      res.status(200).json(result);
  };