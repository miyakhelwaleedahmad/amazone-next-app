import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { id } = req.query;
  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(updated);
}
