import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Settings from "../models/Settings.js";
import Log from "../models/Log.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const initiatePayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.validated.body;

  const booking = await Booking.findById(bookingId).lean();
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // guests only for their own booking
  if (req.user.role === "guest" && booking.guest.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const settings = (await Settings.findOne().lean()) || { currency: "PKR" };

  const payment = await Payment.create({
    booking: bookingId,
    guest: booking.guest,
    amount: booking.totalAmount,
    currency: settings.currency,
    status: "initiated",
    reference: `SIM-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  });

  await Log.create({ actor: req.user.id, action: "INITIATE_PAYMENT", entityType: "Payment", entityId: payment._id.toString() });
  res.status(201).json({ payment });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.validated.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  // simple simulation: always succeeds
  payment.status = "paid";
  await payment.save();

  await Log.create({ actor: req.user.id, action: "CONFIRM_PAYMENT", entityType: "Payment", entityId: paymentId });

  res.json({ payment });
});