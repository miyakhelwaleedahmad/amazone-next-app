// src/pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // TODO: send email with link containing resetToken
    return res.status(200).json({ message: "Password reset link sent", resetToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
