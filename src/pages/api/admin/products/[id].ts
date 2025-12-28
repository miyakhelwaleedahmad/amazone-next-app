// W:\Amazone-clone2\my-app\src\pages\api\admin\products\[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase(); // ✅ fixed
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching product", error });
      }

    case "PUT":
      try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product updated", product });
      } catch (error) {
        return res.status(400).json({ message: "Error updating product", error });
      }

    case "DELETE":
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting product", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
