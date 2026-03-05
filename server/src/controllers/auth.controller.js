import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Log from "../models/Log.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: "guest" });

  await Log.create({ actor: user._id, action: "REGISTER", entityType: "User", entityId: user._id.toString() });

  const token = signToken({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, "7d");
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email });
  if (!user || !user.isActive) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  user.lastLoginAt = new Date();
  await user.save();

  await Log.create({ actor: user._id, action: "LOGIN", entityType: "User", entityId: user._id.toString() });

  const token = signToken({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, "7d");
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});