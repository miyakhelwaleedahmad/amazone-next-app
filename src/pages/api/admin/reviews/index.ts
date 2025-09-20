import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Reviews";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const reviews = await Review.find().populate("productId").populate("customerId");
      return res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching reviews" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
