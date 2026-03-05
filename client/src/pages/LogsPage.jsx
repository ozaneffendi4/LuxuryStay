import React, { useEffect, useState } from "react";
import Card from "../components/common/Card.jsx";
import { logService } from "../services/log.service.js";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await logService.list();
      setLogs(data);
    })();
  }, []);

  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">System Logs</div>
      <div className="mt-4 grid gap-2">
        {logs.map((l) => (
          <div key={l._id} className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">{l.action}</div>
              <div className="text-slate-500">{new Date(l.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-1 text-slate-600">
              Actor: {l.actor?.name || "System"} • Level: {l.level} • Entity: {l.entityType} {l.entityId}
            </div>
          </div>
        ))}
        {!logs.length ? <div className="text-sm text-slate-600">No logs.</div> : null}
      </div>
    </Card>
  );
}