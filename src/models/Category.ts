// src/models/Category.ts
import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId | null;
  image?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Ensure DB-level unique index (safer than relying only on `unique: true`)
CategorySchema.index({ slug: 1 }, { unique: true, background: true });

// Simple slugifier used if slug is missing
function makeSlug(s: string) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Pre-validate: set slug if missing, and validate parent
CategorySchema.pre<ICategory>("validate", function (next) {
  try {
    // this.slug may be empty; generate from name
    if (this.name && !this.slug) {
      this.slug = makeSlug(this.name);
    }

    // if parent provided, ensure it's a valid ObjectId
    if (this.parent && !mongoose.isValidObjectId(this.parent)) {
      throw new Error("Invalid parent category id");
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

// Clean JSON output for frontend: id instead of _id, remove __v
CategorySchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret._id;
    return ret;
  },
});

const Category: Model<ICategory> =
  (models.Category as Model<ICategory>) || model<ICategory>("Category", CategorySchema);

export default Category;
