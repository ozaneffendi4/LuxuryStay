import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    taxPercent: { type: Number, default: 5, min: 0, max: 100 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    hotelPolicies: { type: String, default: "Standard hotel policies apply." },
    currency: { type: String, default: "PKR" }
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);