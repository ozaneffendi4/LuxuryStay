import React from "react";
import Card from "../../components/common/Card.jsx";

export default function ManagerDashboard() {
  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">Manager Dashboard</div>
      <div className="mt-2 text-sm text-slate-600">
        You can manage bookings, approve/cancel reservations, and view occupancy stats from the bookings page.
      </div>
    </Card>
  );
}