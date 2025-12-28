// src/pages/api/admin/refresh-token.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const cookies = req.headers.cookie || "";
  const match = cookies.match(/refresh_token=([^;]+)/);
  const refreshToken = match ? match[1] : null;

  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const admin = await Admin.findById(payload.id);
    if (!admin) return res.status(401).json({ message: "Invalid refresh token" });

    const newAccess = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    // set access cookie
    const secure = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", [
      `access_token=${newAccess}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Strict; ${secure ? "Secure;" : ""}`,
    ]);

    return res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("refresh-token error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
