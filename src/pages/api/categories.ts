// W:\Amazone-clone2\my-app\src\pages\api\categories.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import mongoose, { Schema, model, models } from "mongoose";

// ✅ Category schema
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CategorySchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  // GET all categories
  if (req.method === "GET") {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      return res.status(200).json(categories);
    } catch (err) {
      console.error("GET categories error:", err);
      return res.status(500).json({ message: "Error fetching categories" });
    }
  }

  // POST new category
  if (req.method === "POST") {
    try {
      const { name, slug, description } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ message: "Name and slug are required" });
      }

      const existing = await Category.findOne({ slug });
      if (existing) return res.status(400).json({ message: "Slug already exists" });

      const category = new Category({ name, slug, description });
      await category.save();
      return res.status(201).json(category);
    } catch (err) {
      console.error("POST category error:", err);
      return res.status(500).json({ message: "Error creating category" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
