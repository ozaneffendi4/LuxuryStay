import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminOverview = asyncHandler(async (req, res) => {
  const [totalBookings, totalUsers, totalRooms] = await Promise.all([
    Booking.countDocuments(),
    User.countDocuments(),
    Room.countDocuments({ isActive: true })
  ]);

  const revenueAgg = await Booking.aggregate([
    { $match: { status: { $in: ["approved", "checked_in", "checked_out"] } } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
  ]);

  const revenue = revenueAgg?.[0]?.revenue || 0;

  const occupancyAgg = await Booking.aggregate([
    { $match: { status: { $in: ["approved", "checked_in"] } } },
    { $group: { _id: "$room", count: { $sum: 1 } } },
    { $count: "occupiedCount" }
  ]);
  const occupiedCount = occupancyAgg?.[0]?.occupiedCount || 0;

  res.json({
    stats: { totalBookings, totalUsers, totalRooms, revenue, occupiedCount }
  });
});

export const revenueByMonth = asyncHandler(async (req, res) => {
  const data = await Booking.aggregate([
    { $match: { status: { $in: ["approved", "checked_in", "checked_out"] } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        bookings: { $sum: 1 }
      }
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } }
  ]);

  res.json({
    points: data.map(d => ({
      month: `${d._id.y}-${String(d._id.m).padStart(2, "0")}`,
      revenue: d.revenue,
      bookings: d.bookings
    }))
  });
});