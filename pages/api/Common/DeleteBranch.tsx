import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/Common/DeleteBranch:
 *   delete:
 *     summary: Deletes a branch
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the branch to delete
 *     responses:
 *       200:
 *         description: The deleted branch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
export default async (req:any, res:any) => {
     const { id } = req.query;
      const result = await prisma.branch.delete({
        where: {
            branchId: parseInt(id)
        }
      });
      res.status(200).json(result);
  };