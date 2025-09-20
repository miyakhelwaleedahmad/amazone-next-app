// W:\Amazone-clone2\my-app\src\pages\api\products\[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Product from "@/models/Product"; // ✅ Your Product mongoose model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  switch (req.method) {
    case "GET": // 🔹 Get single product by ID
      try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching product", error });
      }

    case "PUT": // 🔹 Update product
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product updated", product: updatedProduct });
      } catch (error) {
        return res.status(400).json({ message: "Error updating product", error });
      }

    case "DELETE": // 🔹 Delete product
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting product", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
