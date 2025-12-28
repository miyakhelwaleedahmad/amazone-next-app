import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Coupon from "@/models/Coupons";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const coupons = await Coupon.find();
      return res.status(200).json(coupons);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching coupons" });
    }
  }

  if (req.method === "POST") {
    try {
      const { code, discountType, discountValue, expiresAt } = req.body;
      const coupon = new Coupon({ code, discountType, discountValue, expiresAt });
      await coupon.save();
      return res.status(201).json(coupon);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error creating coupon" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
