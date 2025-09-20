import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.method === "GET") {
    return res.status(200).json(product.priceHistory);
  }

  if (req.method === "POST") {
    product.priceHistory.push({ price: req.body.price });
    await product.save();
    return res.status(201).json(product);
  }

  res.status(405).json({ message: "Method not allowed" });
}
