import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  // In real scenario, get adminId from cookie/session
  const admin = await Admin.findOne(); // Temporary: assumes only one admin

  if (!admin) return res.status(401).json({ allowed: false });

  const now = new Date();
  const lastLogin = new Date(admin.lastLoginDate);
  const diffInMonths = (now.getFullYear() - lastLogin.getFullYear()) * 12 + (now.getMonth() - lastLogin.getMonth());

  if (diffInMonths >= 2) return res.status(401).json({ allowed: false });

  return res.status(200).json({ allowed: true });
}
