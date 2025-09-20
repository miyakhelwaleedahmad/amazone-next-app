// src/pages/api/admin/categories/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "../../../lib/mongodb"; // your db connection
import Category from "@/models/Category";
import { requireAdmin } from "../../../lib/requireAdmin"; // middleware

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase;

  if (req.method === "GET") {
    try {
      const categories = await Category.find().sort({ name: 1 }).lean();
      return res.status(200).json(categories);
    } catch (err) {
      console.error("GET categories error:", err);
      return res.status(500).json({ message: "Server error fetching categories" });
    }
  }

  if (req.method === "POST") {
    const { name, description } = req.body ?? {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Category name is required" });
    }

    try {
      // Generate slug
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      const exists = await Category.findOne({ slug });
      if (exists) return res.status(409).json({ message: "Category already exists" });

      const created = await Category.create({ name: name.trim(), slug, description });
      return res.status(201).json(created);
    } catch (err) {
      console.error("POST category error:", err);
      return res.status(500).json({ message: "Server error creating category" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

// Wrap API with admin check
export default requireAdmin(handler);
