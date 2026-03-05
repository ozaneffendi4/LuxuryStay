import React, { useEffect, useState } from "react";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { settingsService } from "../../services/settings.service.js";

export default function SettingsPage() {
  const [s, setS] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await settingsService.get();
      setS(data);
    })();
  }, []);

  async function save() {
    const updated = await settingsService.update({
      taxPercent: Number(s.taxPercent),
      discountPercent: Number(s.discountPercent),
      currency: s.currency,
      hotelPolicies: s.hotelPolicies
    });
    setS(updated);
  }

  if (!s) return <div className="p-6">Loading...</div>;

  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">System Settings</div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input label="Tax %" type="number" value={s.taxPercent} onChange={(e) => setS({ ...s, taxPercent: e.target.value })} />
        <Input label="Discount %" type="number" value={s.discountPercent} onChange={(e) => setS({ ...s, discountPercent: e.target.value })} />
        <Input label="Currency" value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value })} />
      </div>

      <div className="mt-4">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-700">Hotel Policies</div>
          <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={5} value={s.hotelPolicies} onChange={(e) => setS({ ...s, hotelPolicies: e.target.value })} />
        </label>
      </div>

      <Button className="mt-4" onClick={save}>Save Settings</Button>
    </Card>
  );
}