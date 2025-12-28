import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  try {
    const { products } = req.body; // expect array
    const inserted = await Product.insertMany(products);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: "Import failed", error: err });
  }
}
