// src/pages/api/admin/orders/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import mongoose, { Schema, models, model } from "mongoose";

// ✅ Reuse Order Schema
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
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json(order);
    }

    if (req.method === "PUT") {
      const { status, products, totalAmount } = req.body;

      const updated = await Order.findByIdAndUpdate(
        id,
        { status, products, totalAmount },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const deleted = await Order.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json({ message: "Order deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("Order API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
