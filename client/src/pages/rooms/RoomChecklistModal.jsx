import React, { useState } from "react";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import { roomService } from "../../services/room.service.js";

export default function RoomChecklistModal({ room, onClose, onSaved }) {
  const checklist = room?.serviceChecklist || {};

  const [form, setForm] = useState({
    cleaningDone: checklist.cleaningDone || false,
    wifiChecked: checklist.wifiChecked || false,
    acChecked: checklist.acChecked || false,
    bathroomSuppliesReady: checklist.bathroomSuppliesReady || false,
    minibarStocked: checklist.minibarStocked || false,
    notes: checklist.notes || ""
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(name) {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  async function saveChecklist() {
    setBusy(true);
    setError("");

    try {
      await roomService.updateChecklist(room._id, form);
      await onSaved();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save checklist");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <Card className="w-full max-w-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-poppins text-lg font-bold">Room Checklist</div>
            <div className="text-sm text-slate-500">{room.title}</div>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-5 grid gap-3">
          {[
            ["cleaningDone", "Cleaning done"],
            ["wifiChecked", "WiFi checked"],
            ["acChecked", "AC checked"],
            ["bathroomSuppliesReady", "Bathroom supplies ready"],
            ["minibarStocked", "Minibar stocked"]
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={() => toggle(key)}
                className="h-4 w-4"
              />
            </label>
          ))}

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-700">Notes</div>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Write service notes here..."
            />
          </label>

          {error ? (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={saveChecklist} disabled={busy}>
              {busy ? "Saving..." : "Save Checklist"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}