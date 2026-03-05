import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find()
    .populate("actor", "name email role")
    .sort({ createdAt: -1 })
    .limit(300)
    .lean();
  res.json({ logs });
});