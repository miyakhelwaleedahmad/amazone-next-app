import { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    type: { type: String, enum: ["sales", "orders", "customers"], required: true },
    data: { type: Object, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Report = models.Report || model("Report", ReportSchema);
export default Report;
