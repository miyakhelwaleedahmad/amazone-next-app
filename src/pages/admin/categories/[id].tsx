// src/pages/api/admin/categories/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/requireAdmin";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase;

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Category ID is required" });
  }

  // GET one category
  if (req.method === "GET") {
    try {
      const category = await Category.findById(id).lean();
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json(category);
    } catch (err) {
      console.error("GET category error:", err);
      return res.status(500).json({ message: "Server error fetching category" });
    }
  }

  // UPDATE category
  if (req.method === "PUT") {
    const { name, description, parent, image, isActive } = req.body ?? {};
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (name) {
        category.name = name.trim();
        category.slug = String(name)
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
           .replace(/\s+/g, "-");
      }

      if (description !== undefined) category.description = description;
      if (parent !== undefined) category.parent = parent || null;
      if (image !== undefined) category.image = image;
      if (typeof isActive === "boolean") category.isActive = isActive;

      await category.save();

      return res.status(200).json(category);
    } catch (err) {
      console.error("PUT category error:", err);
      return res.status(500).json({ message: "Server error updating category" });
    }
  }

  // DELETE category
  if (req.method === "DELETE") {
    try {
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
      console.error("DELETE category error:", err);
      return res.status(500).json({ message: "Server error deleting category" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default requireAdmin(handler);
