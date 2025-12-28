// src/pages/api/admin/verify-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXP = "15m";
const REFRESH_TOKEN_EXP_SECONDS = 7 * 24 * 60 * 60; // 7 days

function setCookie(res: NextApiResponse, name: string, value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", [
    `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Strict; ${secure ? "Secure;" : ""}`,
  ]);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { email, otp } = req.body as { email?: string; otp?: string };
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    if (!admin.otp || !admin.otpExpires || Date.now() > admin.otpExpires) {
      return res.status(401).json({ message: "OTP expired or invalid" });
    }

    if (admin.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // clear OTP
    admin.otp = null;
    admin.otpExpires = null;

    // set login info
    admin.lastLogin = new Date();
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    admin.lastIp = ip;
    await admin.save();

    // issue tokens
    const accessToken = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET!, {
      expiresIn: ACCESS_TOKEN_EXP,
    });

    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: `${REFRESH_TOKEN_EXP_SECONDS}s`,
    });

    // set cookies
    setCookie(res, "access_token", accessToken, 15 * 60); // 15 min
    setCookie(res, "refresh_token", refreshToken, REFRESH_TOKEN_EXP_SECONDS);

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
