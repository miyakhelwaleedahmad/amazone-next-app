// src/lib/requireAdmin.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"; // if using next-auth
import User from "@/models/User";

/**
 * Middleware to protect admin-only API routes
 */
export function requireAdmin(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Example: using next-auth session
      const session = await getSession({ req });

      if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Fetch user from DB
      const user = await User.findOne({ email: session.user.email });
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }

      // All good, continue to original handler
      return handler(req, res);
    } catch (err) {
      console.error("requireAdmin error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
