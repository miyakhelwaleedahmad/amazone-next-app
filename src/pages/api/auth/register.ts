// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  // Try connect and fail fast with a clear message
  try {
    await connectToDatabase();
  } catch (err: any) {
    console.error("DB connect error (auth/register):", err.message || err);
    return res.status(500).json({ message: "Database connection failed", error: err.message || String(err) });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const safeUser = { _id: newUser._id, name: newUser.name, email: newUser.email };
    return res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (error: any) {
    console.error("Register error (auth/register):", error);
    return res.status(500).json({ message: "Server error", error: error.message || String(error) });
  }
}
