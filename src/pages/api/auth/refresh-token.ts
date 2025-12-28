// src/pages/api/auth/refresh-token.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
