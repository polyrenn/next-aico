import { prisma } from "../../../lib/prisma"; // Adjust path as needed

export default async (req: any, res: any) => {
  const {
    branch,
    searchTerm = '', // renamed from query to be more explicit
    cursor, // Add cursor support
    limit = '20',
  } = req.query;

  const limitNum = parseInt(limit, 10);
  const branchId = parseInt(branch, 10);

  if (isNaN(limitNum) || limitNum < 1) {
    return res.status(400).json({ error: "Invalid limit number" });
  }
  if (isNaN(branchId)) {
    return res.status(400).json({ error: "Invalid branch ID" });
  }

  const whereClause: any = {
    branchId: branchId,
  };

  // Improved search logic
  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    const trimmedSearch = searchTerm.trim();
    whereClause.OR = [
      { name: { contains: trimmedSearch, mode: 'insensitive' } },
      { phone: { contains: trimmedSearch } },
      { uniqueId: { contains: trimmedSearch, mode: 'insensitive' } }, // Added uniqueId search
    ];
  }

  try {
    const items = await prisma.customer.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        branchId: true,
        phone: true,
        uniqueId: true,
        customerType: true,
        purchaseCount: true,
      },
      take: limitNum + 1, // Take one extra to determine if there are more
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { name: 'asc' },
    });

    const hasNextPage = items.length > limitNum;
    const slicedItems = hasNextPage ? items.slice(0, -1) : items;
    
    res.status(200).json({
      items: slicedItems,
      nextCursor: hasNextPage ? items[items.length - 2].id : undefined,
      hasNextPage,
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};