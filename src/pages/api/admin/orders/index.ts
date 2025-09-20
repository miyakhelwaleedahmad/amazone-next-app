// src/pages/api/admin/orders/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import mongoose, { Schema, models, model } from "mongoose";

// ✅ Order Schema
const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    if (req.method === "POST") {
      const { userId, products, totalAmount } = req.body;
      if (!userId || !products || !totalAmount) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const newOrder = await Order.create({ userId, products, totalAmount });
      return res.status(201).json(newOrder);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("Order API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
