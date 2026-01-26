import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/DeleteCompany:
 *   delete:
 *     summary: Deletes a company
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the company to delete
 *     responses:
 *       200:
 *         description: The deleted company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
export default async (req:any, res:any) => {
     const { id } = req.query;
      const result = await prisma.company.delete({
        where: {
            companyId: parseInt(id)
        }
      });
      res.status(200).json(result);
  };