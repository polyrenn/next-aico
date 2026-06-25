import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { reserveCrbNumber } from "../../../lib/crb-lock";

const toDateOnly = (value?: string) => {
  const source = value ? new Date(value) : new Date();
  return new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth(), source.getUTCDate()));
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let data = req.body;
    
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    const branchId = parseInt(data.branchId);

    // Always generate a fresh CRB number via reserveCrbNumber,
    // whether this is a walk-in or a queue-based order.
    // Queue items have their own separate numbering (Q-1, Q-2, etc.)
    // that doesn't correspond to real CRB numbers.

    // Atomically reserve a CRB number + insert
    const amount = parseInt(data.amount);
    const totalKg = parseFloat(data.totalKg);
    const crbDate = toDateOnly(data.date);
    const idempotencyKey = typeof data.idempotencyKey === 'string' && data.idempotencyKey.trim()
      ? data.idempotencyKey.trim()
      : null;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (idempotencyKey) {
      const existingCrb = await prisma.crb.findUnique({
        where: {
          branchId_idempotencyKey: {
            branchId,
            idempotencyKey,
          },
        },
      });

      if (existingCrb) {
        return res.status(200).json({ ...existingCrb, isDuplicate: true });
      }
    }

    const { result, crbNumber } = await reserveCrbNumber(branchId, async (client, crbNumber) => {
      let duplicate = idempotencyKey
        ? await client.crb.findUnique({
            where: {
              branchId_idempotencyKey: {
                branchId,
                idempotencyKey,
              },
            },
          })
        : null;

      // Legacy fallback for older callers without a transaction key.
      if (!duplicate && !idempotencyKey) {
        duplicate = await client.crb.findFirst({
          where: {
            branchId,
            customerId: data.customerId,
            amount,
            totalKg,
            date: crbDate,
            timestamp: { gte: fiveMinutesAgo },
          },
          orderBy: { timestamp: 'desc' },
        });
      }

      if (duplicate) {
        // Return existing record instead of creating a new one
        return { ...duplicate, isDuplicate: true };
      }

      try {
        return await client.crb.create({
          data: {
            branch: { connect: { branchId } },
            crbNumber,
            customerId: data.customerId,
            description: data.description,
            amount,
            totalKg,
            category: data.category,
            idempotencyKey,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            date: crbDate,
          },
        });
      } catch (error: any) {
        if (idempotencyKey && error.code === 'P2002') {
          const existingCrb = await client.crb.findUnique({
            where: {
              branchId_idempotencyKey: {
                branchId,
                idempotencyKey,
              },
            },
          });

          if (existingCrb) {
            return { ...existingCrb, isDuplicate: true };
          }
        }

        throw error;
      }
    });

    // If duplicate was found, return the original CRB number
    const finalCrbNumber = (result as any).isDuplicate ? (result as any).crbNumber : crbNumber;
    res.status(200).json({ ...result, crbNumber: finalCrbNumber, isDuplicate: !!(result as any).isDuplicate });
  } catch (error: any) {
    console.error('Error inserting CRB:', error);
    res.status(500).json({ message: 'Failed to insert CRB', error: error.message });
  }
};
