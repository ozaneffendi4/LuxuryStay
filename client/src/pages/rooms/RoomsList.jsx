import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { roomService } from "../../services/room.service.js";
import { useAuth } from "../../hooks/useAuth.js";
import RoomForm from "./RoomForm.jsx";
import RoomChecklistModal from "./RoomChecklistModal.jsx";
import { money } from "../../utils/format.js";
import { settingsService } from "../../services/settings.service.js";

function ChecklistBadge({ done, label }) {
  return (
    <div
      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
        done ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {label}: {done ? "Done" : "Pending"}
    </div>
  );
}

export default function RoomsList() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [q, setQ] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [checklistRoom, setChecklistRoom] = useState(null);

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
    return rooms.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  }, [rooms, q]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="w-full md:max-w-md">
          <Input
            label="Search rooms"
            placeholder="Deluxe, Suite..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {user.role === "admin" ? (
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add Room
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {filtered.map((r) => {
          const checklist = r.serviceChecklist || {};
          const completedCount = [
            checklist.cleaningDone,
            checklist.wifiChecked,
            checklist.acChecked,
            checklist.bathroomSuppliesReady,
            checklist.minibarStocked
          ].filter(Boolean).length;

          return (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="overflow-hidden">
                <div className="h-40 w-full bg-slate-100">
                  {r.images?.[0] ? (
                    <img src={r.images[0]} alt={r.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="p-4">
                  <div className="font-poppins text-base font-bold">{r.title}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {r.category} • Capacity {r.capacity}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">
                      {money(r.pricePerNight, currency)} / night
                    </div>
                    <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {r.status}
                    </div>
                  </div>

                  {(user.role === "staff" || user.role === "admin" || user.role === "manager") ? (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-700">Service Checklist</div>
                        <div className="text-xs font-bold text-slate-900">{completedCount}/5</div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <ChecklistBadge done={checklist.cleaningDone} label="Clean" />
                        <ChecklistBadge done={checklist.wifiChecked} label="WiFi" />
                        <ChecklistBadge done={checklist.acChecked} label="AC" />
                        <ChecklistBadge done={checklist.bathroomSuppliesReady} label="Bathroom" />
                        <ChecklistBadge done={checklist.minibarStocked} label="Minibar" />
                      </div>

                      {checklist.updatedAt ? (
                        <div className="mt-3 text-[11px] text-slate-500">
                          Updated by: {checklist.updatedBy?.name || "Staff"} •{" "}
                          {new Date(checklist.updatedAt).toLocaleString()}
                        </div>
                      ) : (
                        <div className="mt-3 text-[11px] text-slate-500">
                          No checklist update yet.
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="mt-4 flex gap-2">
                    {user.role === "guest" ? (
                      <Button
                        variant="secondary"
                        onClick={() => (window.location.href = `/app/book-room?roomId=${r._id}`)}
                      >
                        Book
                      </Button>
                    ) : null}

                    {user.role === "staff" ? (
                      <Button
                        variant="secondary"
                        onClick={() => setChecklistRoom(r)}
                      >
                        Checklist
                      </Button>
                    ) : null}

                    {user.role === "admin" ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => setChecklistRoom(r)}
                        >
                          Checklist
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditing(r);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {open ? (
        <RoomForm
          initial={editing}
          onClose={() => setOpen(false)}
          onSaved={async () => {
            setOpen(false);
            await load();
          }}
        />
      ) : null}

      {checklistRoom ? (
        <RoomChecklistModal
          room={checklistRoom}
          onClose={() => setChecklistRoom(null)}
          onSaved={async () => {
            setChecklistRoom(null);
            await load();
          }}
        />
      ) : null}
    </div>
  );
}