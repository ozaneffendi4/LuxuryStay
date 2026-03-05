import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { roomService } from "../../services/room.service.js";
import { useAuth } from "../../hooks/useAuth.js";
import RoomForm from "./RoomForm.jsx";
import { money } from "../../utils/format.js";
import { settingsService } from "../../services/settings.service.js";

export default function RoomsList() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [q, setQ] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    const settings = await settingsService.get();
    setCurrency(settings.currency || "PKR");
    const data = await roomService.list({ q: q || undefined });
    setRooms(data);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rooms;
    return rooms.filter(r => r.title.toLowerCase().includes(q.toLowerCase()));
  }, [rooms, q]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="w-full md:max-w-md">
          <Input label="Search rooms" placeholder="Deluxe, Suite..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {user.role === "admin" ? (
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            Add Room
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {filtered.map((r) => (
          <motion.div key={r._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="overflow-hidden">
              <div className="h-40 w-full bg-slate-100">
                {r.images?.[0] ? <img src={r.images[0]} alt={r.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="p-4">
                <div className="font-poppins text-base font-bold">{r.title}</div>
                <div className="mt-1 text-xs text-slate-500">{r.category} • Capacity {r.capacity}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">{money(r.pricePerNight, currency)} / night</div>
                  <div className="text-xs rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">{r.status}</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={() => (window.location.href = `/app/book-room?roomId=${r._id}`)}>
                    Book
                  </Button>
                  {user.role === "admin" ? (
                    <Button variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}>
                      Edit
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {open ? (
        <RoomForm
          initial={editing}
          onClose={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await load(); }}
        />
      ) : null}
    </div>
  );
}