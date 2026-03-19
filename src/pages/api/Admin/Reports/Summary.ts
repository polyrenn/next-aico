import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withSessionRoute } from "@/lib/withSession";
import dayjs from "dayjs";

interface BranchAggregation {
  branchId: number;
  _sum: { amount: number | null; totalKg: number | null };
  _count: { id: number };
}

interface PaymentMethodAggregation {
  paymentMethod: string | null;
  _sum: { amount: number | null };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;

  // 1. Auth & Admin/Supervisor Check
  if (!user || (user.role !== 'Admin' && user.role !== 'Supervisor')) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { reportType = "daily", branchId = "all", companyId = "all", startDate, endDate } = req.query as {
    reportType: string;
    branchId: string;
    companyId: string;
    startDate?: string;
    endDate?: string;
  };

  try {
    let start: Date;
    let end: Date = dayjs().endOf("day").toDate();

    // 2. Determine Date Range
    switch (reportType) {
      case "weekly":
        start = dayjs().startOf("week").toDate();
        break;
      case "monthly":
        start = dayjs().startOf("month").toDate();
        break;
      case "custom":
        if (!startDate || !endDate) return res.status(400).json({ error: "Start and end dates required for custom range" });
        start = dayjs(startDate).startOf("day").toDate();
        end = dayjs(endDate).endOf("day").toDate();
        break;
      case "daily":
      default:
        start = dayjs().startOf("day").toDate();
        break;
    }

    // 3. Construct Where Clause
    const where: any = {
      timestamp: {
        gte: start,
        lte: end,
      },
      // If Supervisor, strictly restrict to their company
      ...(user.role === 'Supervisor' ? { branch: { companyID: user.company } } : {})
    };

    // Filter by Company if not 'all' and user is Admin
    if (companyId !== "all" && user.role === 'Admin') {
      where.branch = { ...where.branch, companyID: parseInt(companyId) };
    }

    if (branchId !== "all") {
      where.branchId = parseInt(branchId);
    }

    // 4. Cumulative Aggregation
    const cumulative = await prisma.sale.aggregate({
      where,
      _sum: {
        amount: true,
        totalKg: true,
      },
      _count: {
        id: true,
      },
    });

    // 5. Branch Breakdown Aggregation
    const branchBreakdownInput = await prisma.sale.groupBy({
      by: ['branchId'],
      where,
      _sum: {
        amount: true,
        totalKg: true,
      },
      _count: {
        id: true,
      },
    });
    const branchBreakdown = branchBreakdownInput as unknown as BranchAggregation[];

    // 6. Enrichment: Get Payment Method breakdown for the cumulative period
    const paymentMethodsInput = await prisma.sale.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: {
        amount: true,
      },
    });
    const paymentMethods = paymentMethodsInput as unknown as PaymentMethodAggregation[];

    // 7. Enrichment: Get Branch Names for the breakdown
    const branchNames = await prisma.branch.findMany({
      where: {
        branchId: { in: branchBreakdown.map((b: BranchAggregation) => b.branchId) }
      },
      select: {
        branchId: true,
        name: true
      }
    });

    // 8. Format Response
    const response = {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        type: reportType
      },
      summary: {
        totalAmount: cumulative._sum.amount || 0,
        totalKg: cumulative._sum.totalKg || 0,
        transactionCount: cumulative._count.id || 0,
        cashTotal: paymentMethods.find((p: PaymentMethodAggregation) => p.paymentMethod?.toLowerCase() === 'cash')?._sum.amount || 0,
        posTotal: paymentMethods.find((p: PaymentMethodAggregation) => p.paymentMethod?.toLowerCase() === 'pos')?._sum.amount || 0,
      },
      branches: branchBreakdown.map((b: BranchAggregation) => ({
        branchId: b.branchId,
        name: branchNames.find((bn: { branchId: number; name: string | null }) => bn.branchId === b.branchId)?.name || `Branch #${b.branchId}`,
        totalAmount: b._sum.amount || 0,
        totalKg: b._sum.totalKg || 0,
        transactionCount: b._count.id || 0,
      })).sort((a: any, b: any) => b.totalAmount - a.totalAmount)
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Report generation error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
}

export default withSessionRoute(handler);
