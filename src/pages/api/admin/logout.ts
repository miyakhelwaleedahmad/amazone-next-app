// src/pages/api/admin/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const secure = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", [
    `access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${secure ? "Secure;" : ""}`,
    `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${secure ? "Secure;" : ""}`,
  ]);
  return res.status(200).json({ message: "Logged out" });
}
