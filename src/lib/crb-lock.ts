import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

/**
 * Atomically reserves the next CRB number for a branch.
 * 
 * Uses a Postgres advisory lock scoped to the branch ID to ensure
 * only one request at a time can read the current max and compute
 * the next number. The lock is automatically released when the
 * transaction ends.
 * 
 * @param branchId - The branch to reserve a number for
 * @param createFn - A callback that receives (tx, crbNumber) and 
 *                   should create the record (crb, queue, etc.) 
 *                   inside the same transaction
 * @returns The result of createFn + the reserved crbNumber
 */
export async function reserveCrbNumber<T>(
  branchId: number,
  createFn: (tx: Prisma.TransactionClient, crbNumber: number) => Promise<T>
): Promise<{ result: T; crbNumber: number }> {
  return await prisma.$transaction(async (tx) => {
    // Acquire an advisory lock scoped to this branch.
    // pg_advisory_xact_lock is transaction-scoped — it automatically
    // releases when this transaction commits or rolls back.
    // Using branchId as the lock key so different branches don't block each other.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${branchId})`;

    // Compute today's start for the daily reset window
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const todayStart = new Date(`${formattedDate}T00:00:00.000Z`);

    // Read max CRB number across crbs and sales only
    // (queue has its own separate numbering — online orders don't consume CRB numbers)
    const [crbMax, saleMax] = await Promise.all([
      tx.crb.aggregate({
        _max: { crbNumber: true },
        where: { branchId, timestamp: { gte: todayStart } },
      }),
      tx.sale.aggregate({
        _max: { saleNumber: true },
        where: { branchId, timestamp: { gte: todayStart }, category: { not: 'Switch' } },
      }),
    ]);

    const maxCrb = crbMax._max.crbNumber || 0;
    const maxSale = saleMax._max.saleNumber || 0;

    const crbNumber = Math.max(maxCrb, maxSale) + 1;

    // Execute the caller's create operation inside this same transaction,
    // so the write happens BEFORE the lock is released
    const result = await createFn(tx, crbNumber);

    return { result, crbNumber };
  });
}

/**
 * Reads the next CRB number without reserving it (preview only).
 * 
 * This is a lock-free read — it does NOT acquire an advisory lock.
 * The number shown may be slightly stale if another request is
 * concurrently reserving a number, but that's fine for a preview.
 * The actual reservation in reserveCrbNumber still uses the lock
 * to guarantee uniqueness.
 */
export async function peekNextCrbNumber(branchId: number): Promise<number> {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const todayStart = new Date(`${formattedDate}T00:00:00.000Z`);

  const [crbMax, saleMax] = await Promise.all([
    prisma.crb.aggregate({
      _max: { crbNumber: true },
      where: { branchId, timestamp: { gte: todayStart } },
    }),
    prisma.sale.aggregate({
      _max: { saleNumber: true },
      where: { branchId, timestamp: { gte: todayStart }, category: { not: 'Switch' } },
    }),
  ]);

  const maxCrb = crbMax._max.crbNumber || 0;
  const maxSale = saleMax._max.saleNumber || 0;

  return Math.max(maxCrb, maxSale) + 1;
}
