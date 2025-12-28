import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review = models.Review || model("Review", ReviewSchema);
export default Review;
