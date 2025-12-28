// W:\Amazone-clone2\my-app\src\pages\api\admin\products\index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product"; // ✅ Your Product mongoose model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase; // ✅ fixed

  switch (req.method) {
    case "GET":
      try {
        const products = await Product.find({});
        return res.status(200).json(products);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching products", error });
      }

    case "POST":
      try {
        const product = new Product(req.body);
        await product.save();
        return res.status(201).json({ message: "Product created", product });
      } catch (error) {
        return res.status(400).json({ message: "Error creating product", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
