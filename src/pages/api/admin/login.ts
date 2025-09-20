// W:\Amazone-clone2\my-app\src\pages\api\admin\auth\login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import Admin from "../../../models/Admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect;

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ❌ Account locked check
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      return res.status(403).json({
        message: "Account temporarily locked due to too many failed attempts. Try again later.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // ❌ Wrong password → increment failed attempts
      admin.failedAttempts += 1;

      if (admin.failedAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 min
        admin.failedAttempts = 0;
      }
      await admin.save();

      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Reset failed attempts after success
    admin.failedAttempts = 0;
    admin.lockUntil = null;

    // ✅ Save login info
    const currentLoginTime = new Date();
    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "Unknown";

    admin.lastLogin = currentLoginTime;
    admin.lastIp = ip;
    await admin.save();

    // ✅ Create JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // ✅ Email Notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Amazon Clone" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "New Login Detected",
      text: `New login detected on your account:
      
Time: ${currentLoginTime.toLocaleString()}
IP: ${ip}

If this wasn't you, please change your password immediately.`,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      lastLogin: currentLoginTime,
      ip,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
