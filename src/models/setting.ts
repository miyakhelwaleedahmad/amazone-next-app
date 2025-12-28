import { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema(
  {
    siteName: { type: String, required: true },
    logoUrl: { type: String },
    contactEmail: { type: String },
    currency: { type: String, default: "USD" },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", SettingsSchema);
export default Settings;
