// src/pages/api/admin/settings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Schema, model, models } from "mongoose";
import  connectToDatabase from "@/lib/mongodb";

// ✅ Settings Schema
const SettingsSchema = new Schema(
  {
    storeName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    taxRate: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", SettingsSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    if (req.method === "GET") {
      // 📌 Always return the first settings document
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({});
      }
      return res.status(200).json(settings);
    }

    if (req.method === "PUT") {
      // 📌 Update settings (or create if not exist)
      const data = req.body;
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create(data);
      } else {
        Object.assign(settings, data);
        await settings.save();
      }
      return res.status(200).json(settings);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("Settings API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
