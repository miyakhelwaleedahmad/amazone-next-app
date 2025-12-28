// src/pages/api/orders/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  switch (req.method) {
    case "GET": // 🔹 Get single order
      try {
        const order = await Order.findById(id).populate("user").populate("items.product");
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json(order);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching order", error });
      }

    case "PUT": // 🔹 Update order (e.g., change status, shipping info)
      try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "Order updated", order: updatedOrder });
      } catch (error) {
        return res.status(400).json({ message: "Error updating order", error });
      }

    case "DELETE": // 🔹 Cancel/Delete order
      try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "Order deleted" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting order", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
