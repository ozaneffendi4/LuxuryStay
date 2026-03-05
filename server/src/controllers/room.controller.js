import Room from "../models/Room.js";
import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listRooms = asyncHandler(async (req, res) => {
  const { status, q } = req.validated.query;
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: "i" };

  const rooms = await Room.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ rooms });
});

export const getRoom = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await Room.findById(id).lean();
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ room });
});

export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.validated.body);
  await Log.create({ actor: req.user.id, action: "CREATE_ROOM", entityType: "Room", entityId: room._id.toString() });
  res.status(201).json({ room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await Room.findByIdAndUpdate(id, req.validated.body, { new: true });
  if (!room) return res.status(404).json({ message: "Room not found" });
  await Log.create({ actor: req.user.id, action: "UPDATE_ROOM", entityType: "Room", entityId: id });
  res.json({ room });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await Room.findById(id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  // soft delete to preserve booking history
  room.isActive = false;
  await room.save();

  await Log.create({ actor: req.user.id, action: "DELETE_ROOM", entityType: "Room", entityId: id });
  res.json({ message: "Room deactivated" });
});