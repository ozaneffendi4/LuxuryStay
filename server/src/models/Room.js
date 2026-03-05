import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    pricePerNight: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available", index: true },
    capacity: { type: Number, default: 2, min: 1 },
    amenities: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);