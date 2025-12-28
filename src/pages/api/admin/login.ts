// src/pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { sendMail } from "../../../utils/mailer";
import { isRateLimited } from "@/utils/rateLimiter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect(); //  was wrong before — FIXED (you had `await dbConnect;`)

  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: "Too many requests from this IP. Try later." });
  }

  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid email or password" });

    // check account lock
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      return res.status(403).json({ message: "Account temporarily locked. Try again later." });
    }

    // compare password
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      admin.failedAttempts = (admin.failedAttempts || 0) + 1;
      // lock after 5 fails
      if (admin.failedAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lock
        admin.failedAttempts = 0;
      }
      await admin.save();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // success — reset failed attempts
    admin.failedAttempts = 0;
    admin.lockUntil = null;

    // create OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await admin.save();

    // send OTP email (do not block the response too long; but await here to ensure sending)
    await sendMail(admin.email, "Your login code", `Your login verification code: ${otp}\nValid for 5 minutes.`);

    return res.status(200).json({ step: "otp-required", message: "OTP sent to your email." });
  } catch (err) {
    console.error("admin/login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
