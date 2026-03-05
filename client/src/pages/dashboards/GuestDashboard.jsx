import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";

export default function GuestDashboard() {
  return (
    <Card className="p-6">
      <div className="font-poppins text-lg font-bold">Guest Dashboard</div>
      <div className="mt-2 text-sm text-slate-600">
        Browse rooms, book a stay, and view your booking history.
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/app/rooms"><Button>Browse Rooms</Button></Link>
        <Link to="/app/history"><Button variant="secondary">Booking History</Button></Link>
      </div>
    </Card>
  );
}