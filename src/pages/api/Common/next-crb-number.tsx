import { NextApiRequest, NextApiResponse } from "next";
import { peekNextCrbNumber } from "../../../lib/crb-lock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { branch: branchQuery } = req.query;

  if (!branchQuery || typeof branchQuery !== 'string') {
    return res.status(400).json({ message: "Branch query parameter is required and must be a string." });
  }

  const branchId = parseInt(branchQuery, 10);

  if (isNaN(branchId)) {
    return res.status(400).json({ message: "Invalid branch ID provided." });
  }

  try {
    const nextCrbNumber = await peekNextCrbNumber(branchId);
    res.status(200).json({ nextCrbNumber });
  } catch (error) {
    console.error("Error fetching next CRB number:", error);
    res.status(500).json({ message: 'Failed to fetch next CRB number due to an internal error.' });
  }
}
