// W:\Amazone-clone2\my-app\src\models\Admin.ts
import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name?: string;
  email: string;
  password: string;
  role?: string;
  failedAttempts?: number;
  lockUntil?: Date | null;
  otp?: string | null;
  otpExpires?: number | null;
  lastLogin?: Date | null;
  lastIp?: string | null;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true }, // ✅ unique ensures index
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    otp: { type: String, default: null },
    otpExpires: { type: Number, default: null },
    lastLogin: { type: Date, default: null },
    lastIp: { type: String, default: null },
  },
  { timestamps: true } // ✅ adds createdAt/updatedAt automatically
);

// Instance method for comparing password
AdminSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// ✅ Safe model initialization (avoids overwrite on hot-reload in Next.js dev)
const Admin: Model<IAdmin> =
  (mongoose.models.Admin as Model<IAdmin>) || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
