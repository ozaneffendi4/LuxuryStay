import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR" },
    provider: { type: String, default: "simulation" },
    status: { type: String, enum: ["initiated", "paid", "failed"], default: "initiated", index: true },
    reference: { type: String, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);