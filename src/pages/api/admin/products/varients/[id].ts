import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.method === "POST") {
    product.variants.push(req.body);
    await product.save();
    return res.status(201).json(product);
  }

  if (req.method === "PUT") {
    const { variantId, ...data } = req.body;
    const variant = product.variants.id(variantId);
    if (variant) {
      Object.assign(variant, data);
      await product.save();
    }
    return res.status(200).json(product);
  }

  if (req.method === "DELETE") {
    const { variantId } = req.body;
    product.variants.id(variantId)?.remove();
    await product.save();
    return res.status(200).json(product);
  }

  res.status(405).json({ message: "Method not allowed" });
}
