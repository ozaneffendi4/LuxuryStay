import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Settings from "../models/Settings.js";
import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { nightsBetween } from "../utils/dates.js";

function calcAmounts(nights, pricePerNight, taxPercent, discountPercent) {
  const base = nights * pricePerNight;
  const discount = (discountPercent / 100) * base;
  const afterDiscount = Math.max(0, base - discount);
  const tax = (taxPercent / 100) * afterDiscount;
  const total = afterDiscount + tax;
  return { baseAmount: base, discountAmount: discount, taxAmount: tax, totalAmount: total };
}

// search available rooms for date range
export const searchAvailableRooms = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.validated.query;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (!(start < end)) return res.status(400).json({ message: "Invalid date range" });

  const activeRooms = await Room.find({ isActive: true }).lean();
  const bookings = await Booking.find({
    status: { $in: ["pending", "approved", "checked_in"] },
    $or: [{ checkIn: { $lt: end }, checkOut: { $gt: start } }]
  }).select("room checkIn checkOut status").lean();

  const bookedRoomIds = new Set(bookings.map(b => b.room.toString()));
  // NOTE: conservative filter; if any overlap exists, room is excluded
  const available = activeRooms.filter(r => !bookedRoomIds.has(r._id.toString()) && r.status !== "maintenance");

  res.json({ rooms: available });
});

// guest creates booking (pending)
export const createBooking = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, note } = req.validated.body;

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) return res.status(404).json({ message: "Room not found" });

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (!(start < end)) return res.status(400).json({ message: "Invalid date range" });

  const overlap = await Booking.findOne({
    room: roomId,
    status: { $in: ["pending", "approved", "checked_in"] },
    checkIn: { $lt: end },
    checkOut: { $gt: start }
  }).lean();

  if (overlap) return res.status(409).json({ message: "Room already booked for selected dates" });

  const settings = (await Settings.findOne().lean()) || { taxPercent: 5, discountPercent: 0, currency: "PKR" };

  const nights = nightsBetween(start, end);
  if (nights < 1) return res.status(400).json({ message: "Minimum 1 night" });

  const amounts = calcAmounts(nights, room.pricePerNight, settings.taxPercent, settings.discountPercent);

  const booking = await Booking.create({
    guest: req.user.id,
    room: roomId,
    checkIn: start,
    checkOut: end,
    nights,
    ...amounts,
    status: "pending",
    note: note || ""
  });

  await Log.create({
    actor: req.user.id,
    action: "CREATE_BOOKING",
    entityType: "Booking",
    entityId: booking._id.toString(),
    meta: { roomId: roomId, checkIn, checkOut }
  });

  res.status(201).json({ booking });
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user.id })
    .populate("room")
    .sort({ createdAt: -1 })
    .lean();
  res.json({ bookings });
});

// manager/admin/staff can list all (staff uses this for assigned view later)
export const listAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.validated.query;
  const filter = {};
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate("guest", "name email role")
    .populate("room")
    .sort({ createdAt: -1 })
    .lean();
  res.json({ bookings });
});

export const approveBooking = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "pending") return res.status(400).json({ message: "Only pending bookings can be approved" });

  // double-check overlap before approval (strong prevention)
  const overlap = await Booking.findOne({
    _id: { $ne: id },
    room: booking.room,
    status: { $in: ["approved", "checked_in"] },
    checkIn: { $lt: booking.checkOut },
    checkOut: { $gt: booking.checkIn }
  }).lean();
  if (overlap) return res.status(409).json({ message: "Cannot approve: conflicts with another booking" });

  booking.status = "approved";
  booking.approvedBy = req.user.id;
  await booking.save();

  await Log.create({ actor: req.user.id, action: "APPROVE_BOOKING", entityType: "Booking", entityId: id });
  res.json({ booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const allowed = ["pending", "approved"];
  if (!allowed.includes(booking.status)) return res.status(400).json({ message: "Cannot cancel at this stage" });

  // guests can cancel only their own bookings
  if (req.user.role === "guest" && booking.guest.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  booking.status = "cancelled";
  booking.cancelledBy = req.user.id;
  await booking.save();

  await Log.create({ actor: req.user.id, action: "CANCEL_BOOKING", entityType: "Booking", entityId: id });
  res.json({ booking });
});

// staff check-in / check-out
export const checkIn = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const booking = await Booking.findById(id).populate("room");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "approved") return res.status(400).json({ message: "Only approved bookings can be checked in" });

  booking.status = "checked_in";
  booking.checkedInAt = new Date();
  await booking.save();

  // update room status
  await Room.findByIdAndUpdate(booking.room._id, { status: "occupied" });

  await Log.create({ actor: req.user.id, action: "CHECK_IN", entityType: "Booking", entityId: id });
  res.json({ booking });
});

export const checkOut = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const booking = await Booking.findById(id).populate("room");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "checked_in") return res.status(400).json({ message: "Only checked-in bookings can be checked out" });

  booking.status = "checked_out";
  booking.checkedOutAt = new Date();
  await booking.save();

  await Room.findByIdAndUpdate(booking.room._id, { status: "available" });

  await Log.create({ actor: req.user.id, action: "CHECK_OUT", entityType: "Booking", entityId: id });
  res.json({ booking });
});