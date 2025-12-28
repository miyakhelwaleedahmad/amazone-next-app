// src/pages/api/admin/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectToDatabase();
  } catch (err: any) {
    console.error("DB connect error (admin/register):", err.message || err);
    return res.status(500).json({ message: "Database connection failed", error: err.message || String(err) });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

  try {
    const existing = await Admin.findOne({ email }).lean();
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    return res.status(201).json({ message: "Admin registered successfully", admin: { _id: newAdmin._id, name, email } });
  } catch (err: any) {
    console.error("Error registering admin:", err);
    return res.status(500).json({ message: "Error registering admin", error: err.message || String(err) });
  }
}
