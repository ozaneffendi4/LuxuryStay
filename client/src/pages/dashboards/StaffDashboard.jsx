import React from "react";
import Card from "../../components/common/Card.jsx";

export default function StaffDashboard() {
  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">Staff Dashboard</div>
      <div className="mt-2 text-sm text-slate-600">
        You can check-in and check-out guests from the bookings page.
      </div>
    </Card>
  );
}