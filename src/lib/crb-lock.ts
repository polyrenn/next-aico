import { prisma } from './prisma';

const MAX_RETRIES = 3;

/**
 * Computes the next CRB number by reading the current max from
 * both the crb and sale tables for today.
 */
async function getNextCrbNumber(branchId: number): Promise<number> {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const todayStart = new Date(`${formattedDate}T00:00:00.000Z`);

  const [latestCrb, latestSale] = await Promise.all([
    prisma.crb.findFirst({
      where: { branchId, timestamp: { gte: todayStart } },
      orderBy: { crbNumber: 'desc' },
      select: { crbNumber: true },
    }),
    prisma.sale.findFirst({
      where: { branchId, timestamp: { gte: todayStart }, category: { not: 'Switch' } },
      orderBy: { saleNumber: 'desc' },
      select: { saleNumber: true },
    }),
  ]);

  const maxCrb = latestCrb?.crbNumber || 0;
  const maxSale = latestSale?.saleNumber || 0;

  return Math.max(maxCrb, maxSale) + 1;
}

/**
 * Reserves a CRB number and executes a create operation.
 *
 * No advisory lock — with one cashier per branch, contention is
 * effectively zero. The unique constraint on (crbNumber, branchId, date)
 * is the real safety net. If a freak duplicate occurs (P2002), we
 * retry with the next number.
 *
 * @param branchId - The branch to reserve a number for
 * @param createFn - Receives (prismaClient, crbNumber) and should
 *                   create the record. Runs outside a transaction
 *                   for speed — the unique constraint protects us.
 * @returns The result of createFn + the reserved crbNumber
 */
export async function reserveCrbNumber<T>(
  branchId: number,
  createFn: (client: typeof prisma, crbNumber: number) => Promise<T>
): Promise<{ result: T; crbNumber: number }> {
  let lastError: any;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const crbNumber = await getNextCrbNumber(branchId);
    // If retrying after a duplicate, bump the number
    const adjustedNumber = crbNumber + attempt;

    try {
      const result = await createFn(prisma, adjustedNumber);
      return { result, crbNumber: adjustedNumber };
    } catch (error: any) {
      // P2002 = unique constraint violation — another insert beat us
      if (error.code === 'P2002') {
        console.warn(
          `CRB number ${adjustedNumber} already taken for branch ${branchId}, retrying (attempt ${attempt + 1}/${MAX_RETRIES})`
        );
        lastError = error;
        continue;
      }
      // Any other error — throw immediately
      throw error;
    }
  }

  throw lastError;
}

/**
 * Reads the next CRB number without reserving it (preview only).
 * Lock-free read — the number may be slightly stale, which is
 * fine for a preview.
 */
export async function peekNextCrbNumber(branchId: number): Promise<number> {
  return getNextCrbNumber(branchId);
}
