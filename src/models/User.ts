import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs"; // 🔒 for password hashing

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // 🔒 will be hashed automatically

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isActive: { type: Boolean, default: true },

    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// ✅ Index for email
UserSchema.index({ email: 1 });

// ✅ Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if password changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Method to compare password later (for login)
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default models.User || model("User", UserSchema);
