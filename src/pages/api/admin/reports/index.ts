import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Report from "@/models/Report";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const reports = await Report.find();
      return res.status(200).json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching reports" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
