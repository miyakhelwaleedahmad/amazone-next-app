// W:\Amazone-clone2\my-app\src\pages\api\admin\coupons\[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Coupon from "@/models/Coupons";
import { z } from "zod";

// Validation schema for updating coupon
const updateCouponSchema = z.object({
  code: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().optional(),
  expiresAt: z.string().optional(),
  active: z.boolean().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid coupon ID" });
  }

  // GET single coupon
  if (req.method === "GET") {
    try {
      const coupon = await Coupon.findById(id);
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });
      return res.status(200).json(coupon);
    } catch (err) {
      console.error("GET coupon error:", err);
      return res.status(500).json({ message: "Error fetching coupon" });
    }
  }

  // PATCH / update coupon
  if (req.method === "PATCH") {
    try {
      const parsed = updateCouponSchema.parse(req.body);
      const updated = await Coupon.findByIdAndUpdate(id, parsed, { new: true });
      if (!updated) return res.status(404).json({ message: "Coupon not found" });
      return res.status(200).json(updated);
    } catch (err: any) {
      console.error("PATCH coupon error:", err);
      if (err?.issues) {
        return res.status(400).json({ message: "Validation error", errors: err.issues });
      }
      return res.status(500).json({ message: "Error updating coupon" });
    }
  }

  // DELETE coupon
  if (req.method === "DELETE") {
    try {
      const deleted = await Coupon.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Coupon not found" });
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (err) {
      console.error("DELETE coupon error:", err);
      return res.status(500).json({ message: "Error deleting coupon" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
