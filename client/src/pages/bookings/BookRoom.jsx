import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { bookingService } from "../../services/booking.service.js";
import { paymentService } from "../../services/payment.service.js";
import { settingsService } from "../../services/settings.service.js";
import { money } from "../../utils/format.js";

export default function BookRoom() {
  const [sp] = useSearchParams();
  const preRoomId = sp.get("roomId") || "";

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(preRoomId);
  const [note, setNote] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const s = await settingsService.get();
      setCurrency(s.currency || "PKR");
    })();
  }, []);

  const selectedRoom = useMemo(() => rooms.find(r => r._id === roomId), [rooms, roomId]);

  async function search() {
    setMsg("");
    if (!checkIn || !checkOut) return setMsg("Select check-in and check-out.");
    setBusy(true);
    try {
      const data = await bookingService.searchAvailable(checkIn, checkOut);
      setRooms(data);
      if (preRoomId) setRoomId(preRoomId);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function createBooking() {
    setMsg("");
    if (!roomId) return setMsg("Choose a room.");
    setBusy(true);
    try {
      const b = await bookingService.create({ roomId, checkIn, checkOut, note });
      setBooking(b);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  async function payNow() {
    if (!booking?._id) return;
    setBusy(true);
    setMsg("");
    try {
      const p = await paymentService.initiate(booking._id);
      setPayment(p);
      const confirmed = await paymentService.confirm(p._id);
      setPayment(confirmed);
      setMsg("✅ Payment confirmed (simulation). Booking is created and pending approval.");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <div className="font-poppins text-lg font-bold">Book a Room</div>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input label="Check-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <Input label="Check-out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={search} disabled={busy} className="w-full">{busy ? "Searching..." : "Search availability"}</Button>
          </div>
        </div>

        {rooms.length ? (
          <div className="mt-4">
            <div className="text-sm font-semibold text-slate-700">Available rooms</div>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              <option value="">Select a room...</option>
              {rooms.map(r => (
                <option key={r._id} value={r._id}>
                  {r.title} — {money(r.pricePerNight, currency)}/night
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {selectedRoom ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="font-semibold">{selectedRoom.title}</div>
            <div className="text-slate-600">{selectedRoom.category} • Capacity {selectedRoom.capacity}</div>
            <div className="mt-2">{money(selectedRoom.pricePerNight, currency)} / night</div>
          </div>
        ) : null}

        <div className="mt-4">
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-700">Note (optional)</div>
            <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <Button onClick={createBooking} disabled={busy} className="w-full md:w-auto">
            {busy ? "Processing..." : "Create Booking"}
          </Button>
          {booking ? (
            <Button variant="secondary" onClick={payNow} disabled={busy} className="w-full md:w-auto">
              {busy ? "Paying..." : "Pay (Simulation) & Confirm"}
            </Button>
          ) : null}
        </div>

        {booking ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <div className="font-semibold">Booking Summary</div>
            <div className="mt-2 text-slate-600">Status: {booking.status}</div>
            <div className="mt-2">Total: <span className="font-bold">{money(booking.totalAmount, currency)}</span></div>
          </div>
        ) : null}

        {msg ? <div className="mt-4 text-sm font-semibold text-slate-700">{msg}</div> : null}
      </Card>
    </div>
  );
}