// src/models/Product.ts
import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },

    brand: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    images: [{ type: String }], // multiple product images
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // optional sale price
    stock: { type: Number, required: true, default: 0 },

    rating: { type: Number, default: 0 }, // average rating
    numReviews: { type: Number, default: 0 }, // total reviews

    isFeatured: { type: Boolean, default: false }, // for homepage / promotions
    tags: [{ type: String }], // e.g. ["electronics", "mobile"]

    // For tracking which admin created product
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto-generate slug if missing
ProductSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = String(this.name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

export default models.Product || model("Product", ProductSchema);
