import React, { useEffect, useState } from "react";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import { bookingService } from "../../services/booking.service.js";
import { paymentService } from "../../services/payment.service.js";
import { settingsService } from "../../services/settings.service.js";
import { isoDate, money } from "../../utils/format.js";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [currency, setCurrency] = useState("PKR");

  async function load() {
    const s = await settingsService.get();
    setCurrency(s.currency || "PKR");
    const data = await bookingService.myBookings();
    setBookings(data);
  }

  useEffect(() => { load(); }, []);

  async function cancel(id) {
    await bookingService.cancel(id);
    await load();
  }

  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">My Booking History</div>

      <div className="mt-4 grid gap-3">
        {bookings.map((b) => (
          <div key={b._id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <div className="font-semibold">{b.room?.title}</div>
                <div className="text-xs text-slate-600">
                  {isoDate(b.checkIn)} → {isoDate(b.checkOut)} • {b.nights} night(s)
                </div>
                <div className="mt-2 text-sm">
                  Total: <span className="font-bold">{money(b.totalAmount, currency)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{b.status}</div>
                {["pending", "approved"].includes(b.status) ? (
                  <Button variant="secondary" onClick={() => cancel(b._id)}>Cancel</Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {!bookings.length ? <div className="text-sm text-slate-600">No bookings yet.</div> : null}
      </div>
    </Card>
  );
}