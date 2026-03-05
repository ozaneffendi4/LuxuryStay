import React, { useEffect, useState } from "react";
import { DollarSign, Users, CalendarDays, BedDouble } from "lucide-react";
import StatCard from "../../components/common/StatCard.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import RevenueChart from "../../components/charts/RevenueChart.jsx";
import { analyticsService } from "../../services/analytics.service.js";
import { settingsService } from "../../services/settings.service.js";
import { money } from "../../utils/format.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [points, setPoints] = useState([]);
  const [currency, setCurrency] = useState("PKR");

  useEffect(() => {
    (async () => {
      const s = await analyticsService.overview();
      const p = await analyticsService.revenueMonthly();
      const settings = await settingsService.get();
      setCurrency(settings.currency || "PKR");
      setStats(s);
      setPoints(p);
    })();
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Revenue" value={money(stats.revenue, currency)} icon={<DollarSign size={18} />} />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<CalendarDays size={18} />} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={18} />} />
        <StatCard title="Active Rooms" value={stats.totalRooms} icon={<BedDouble size={18} />} />
      </div>

      <RevenueChart data={points} />
    </div>
  );
}