import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Customer from "@/models/customers";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const customers = await Customer.find().populate("orders");
      return res.status(200).json(customers);
    } catch {
      return res.status(500).json({ message: "Error fetching customers" });
    }
  }

  if (req.method === "POST") {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      return res.status(201).json(customer);
    } catch {
      return res.status(400).json({ message: "Error creating customer" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
