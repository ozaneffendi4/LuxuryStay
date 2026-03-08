import Room from "../models/Room.js";
import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listRooms = asyncHandler(async (req, res) => {
  const { status, q } = req.validated.query;
  const filter = { isActive: true };

  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: "i" };

  const rooms = await Room.find(filter)
    .populate("serviceChecklist.updatedBy", "name email role")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ rooms });
});

export const getRoom = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await Room.findById(id)
    .populate("serviceChecklist.updatedBy", "name email role")
    .lean();

  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ room });
});

export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.validated.body);

  await Log.create({
    actor: req.user.id,
    action: "CREATE_ROOM",
    entityType: "Room",
    entityId: room._id.toString()
  });

  res.status(201).json({ room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await Room.findByIdAndUpdate(id, req.validated.body, { new: true });

  if (!room) return res.status(404).json({ message: "Room not found" });

  await Log.create({
    actor: req.user.id,
    action: "UPDATE_ROOM",
    entityType: "Room",
    entityId: id
  });

  res.json({ room });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await Room.findById(id);

  if (!room) return res.status(404).json({ message: "Room not found" });

  room.isActive = false;
  await room.save();

  await Log.create({
    actor: req.user.id,
    action: "DELETE_ROOM",
    entityType: "Room",
    entityId: id
  });

  res.json({ message: "Room deactivated" });
});

// ✅ new checklist updater
export const updateRoomChecklist = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const {
    cleaningDone,
    wifiChecked,
    acChecked,
    bathroomSuppliesReady,
    minibarStocked,
    notes
  } = req.validated.body;

  const room = await Room.findById(id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  room.serviceChecklist = {
    cleaningDone,
    wifiChecked,
    acChecked,
    bathroomSuppliesReady,
    minibarStocked,
    notes: notes || "",
    updatedBy: req.user.id,
    updatedAt: new Date()
  };

  await room.save();

  const populatedRoom = await Room.findById(id)
    .populate("serviceChecklist.updatedBy", "name email role")
    .lean();

  await Log.create({
    actor: req.user.id,
    action: "UPDATE_ROOM_CHECKLIST",
    entityType: "Room",
    entityId: id,
    meta: {
      cleaningDone,
      wifiChecked,
      acChecked,
      bathroomSuppliesReady,
      minibarStocked
    }
  });

  res.json({ room: populatedRoom });
});