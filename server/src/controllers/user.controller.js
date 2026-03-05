import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  res.json({ users });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.validated.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role, createdBy: req.user.id });

  await Log.create({ actor: req.user.id, action: "CREATE_USER", entityType: "User", entityId: user._id.toString() });
  res.status(201).json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { name, role, isActive } = req.validated.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  await Log.create({ actor: req.user.id, action: "UPDATE_USER", entityType: "User", entityId: user._id.toString() });
  res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, isActive: user.isActive } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  await Log.create({ actor: req.user.id, action: "DELETE_USER", entityType: "User", entityId: id });

  res.json({ message: "Deleted" });
});