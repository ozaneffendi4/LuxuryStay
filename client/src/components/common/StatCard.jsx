import React from "react";
import Card from "./Card.jsx";

export default function StatCard({ title, value, icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-600">{title}</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
        <div className="rounded-xl bg-slate-900/5 p-2 text-slate-900">{icon}</div>
      </div>
    </Card>
  );
}