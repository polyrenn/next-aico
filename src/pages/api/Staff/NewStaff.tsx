import { prisma } from "../../../lib/prisma";

export default async (req:any, res:any) => {
    let data = req.body;
    const { branch, company } = req.query
    data = JSON.parse(data);
      const result = await prisma.staff.create({
        data: {
          ...data,
          branch: {
            connect: { branchId: parseInt(branch) },
          },
          company: {
            connect: {companyId: parseInt(company)}
          }
        },
        
      });


      res.status(200).json(result);
  };