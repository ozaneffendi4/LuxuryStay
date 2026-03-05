import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BedDouble, CalendarDays, Users, Settings, ScrollText } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

const linkBase = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition";
const linkActive = "bg-slate-900 text-white";
const linkIdle = "text-slate-700 hover:bg-slate-100";

function Item({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-4 md:flex">
      <div className="mb-4 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="font-poppins text-lg font-bold">LuxuryStay</div>
        <div className="text-xs opacity-80">Hotel Management System</div>
        <div className="mt-3 text-xs opacity-90">
          Signed in as <span className="font-semibold">{user?.name}</span>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Item to="/app" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <Item to="/app/rooms" icon={<BedDouble size={18} />} label="Rooms" />
        <Item to="/app/bookings" icon={<CalendarDays size={18} />} label="Bookings" />
        {user?.role === "admin" ? <Item to="/app/users" icon={<Users size={18} />} label="Users" /> : null}
        {user?.role === "admin" ? <Item to="/app/settings" icon={<Settings size={18} />} label="Settings" /> : null}
        {user?.role === "admin" ? <Item to="/app/logs" icon={<ScrollText size={18} />} label="Logs" /> : null}
      </nav>

      <div className="mt-auto pt-4 text-xs text-slate-500">
        © {new Date().getFullYear()} LuxuryStay
      </div>
    </aside>
  );
}