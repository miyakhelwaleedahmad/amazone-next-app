// W:\Amazone-clone2\my-app\src\pages\api\orders\index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Order from "@/models/Order"; // ✅ Make sure you create Order model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case "GET": // 🔹 Fetch all orders
      try {
        const orders = await Order.find({})
          .populate("user", "name email")
          .populate("items.product", "name price");
        return res.status(200).json(orders);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching orders", error });
      }

    case "POST": // 🔹 Create a new order
      try {
        const order = new Order(req.body);
        await order.save();
        return res.status(201).json({ message: "Order created", order });
      } catch (error) {
        return res.status(400).json({ message: "Error creating order", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
