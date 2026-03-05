import React, { useEffect, useState } from "react";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import { bookingService } from "../../services/booking.service.js";
import { useAuth } from "../../hooks/useAuth.js";
import { isoDate } from "../../utils/format.js";

export default function ManageBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  async function load() {
    const data = await bookingService.listAll({});
    setBookings(data);
  }

  useEffect(() => { load(); }, []);

  async function approve(id) { await bookingService.approve(id); await load(); }
  async function cancel(id) { await bookingService.cancel(id); await load(); }
  async function checkIn(id) { await bookingService.checkIn(id); await load(); }
  async function checkOut(id) { await bookingService.checkOut(id); await load(); }

  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">Bookings</div>
      <div className="mt-2 text-sm text-slate-600">
        {user.role === "manager" ? "Approve/cancel reservations." : user.role === "staff" ? "Check-in/out guests." : "Manage system bookings."}
      </div>

      <div className="mt-4 grid gap-3">
        {bookings.map((b) => (
          <div key={b._id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <div className="font-semibold">{b.room?.title}</div>
                <div className="text-xs text-slate-600">
                  Guest: {b.guest?.name} • {isoDate(b.checkIn)} → {isoDate(b.checkOut)}
                </div>
                <div className="mt-1 text-xs text-slate-600">Status: <b>{b.status}</b></div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(user.role === "manager" || user.role === "admin") && b.status === "pending" ? (
                  <Button onClick={() => approve(b._id)}>Approve</Button>
                ) : null}

                {(user.role === "manager" || user.role === "admin" || user.role === "staff") &&
                ["pending", "approved"].includes(b.status) ? (
                  <Button variant="secondary" onClick={() => cancel(b._id)}>Cancel</Button>
                ) : null}

                {(user.role === "staff" || user.role === "admin") && b.status === "approved" ? (
                  <Button onClick={() => checkIn(b._id)}>Check-in</Button>
                ) : null}

                {(user.role === "staff" || user.role === "admin") && b.status === "checked_in" ? (
                  <Button onClick={() => checkOut(b._id)}>Check-out</Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {!bookings.length ? <div className="text-sm text-slate-600">No bookings found.</div> : null}
      </div>
    </Card>
  );
}