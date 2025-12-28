import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb"; // ✅ fixed import
import Customer from "@/models/customers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const customer = await Customer.findById(id).populate("orders");
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      return res.status(200).json(customer);
    } catch (err) {
      console.error("GET customer error:", err); // ✅ add logging
      return res.status(500).json({ message: "Error fetching customer" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const updated = await Customer.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PATCH customer error:", err); // ✅ add logging
      return res.status(400).json({ message: "Error updating customer" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Customer.findByIdAndDelete(id);
      return res.status(200).json({ message: "Customer deleted" });
    } catch (err) {
      console.error("DELETE customer error:", err); // ✅ add logging
      return res.status(500).json({ message: "Error deleting customer" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
