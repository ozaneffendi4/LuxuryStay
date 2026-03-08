import mongoose from "mongoose";

const roomChecklistSchema = new mongoose.Schema(
  {
    cleaningDone: { type: Boolean, default: false },
    wifiChecked: { type: Boolean, default: false },
    acChecked: { type: Boolean, default: false },
    bathroomSuppliesReady: { type: Boolean, default: false },
    minibarStocked: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedAt: { type: Date, default: null }
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    pricePerNight: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
      index: true
    },
    capacity: { type: Number, default: 2, min: 1 },
    amenities: [{ type: String }],
    isActive: { type: Boolean, default: true },

    // ✅ new checklist block
    serviceChecklist: {
      type: roomChecklistSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);