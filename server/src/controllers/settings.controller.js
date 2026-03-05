import Settings from "../models/Settings.js";
import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSettings = asyncHandler(async (req, res) => {
  let s = await Settings.findOne().lean();
  if (!s) s = await Settings.create({});
  res.json({ settings: s });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  Object.assign(s, req.validated.body);
  await s.save();

  await Log.create({ actor: req.user.id, action: "UPDATE_SETTINGS", entityType: "Settings", entityId: s._id.toString() });
  res.json({ settings: s });
});