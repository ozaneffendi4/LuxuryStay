import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true, index: true },
    entityType: { type: String, default: "" },
    entityId: { type: String, default: "" },
    meta: { type: Object, default: {} },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    level: { type: String, enum: ["info", "warn", "error"], default: "info", index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);