import React from "react";
import { LogOut } from "lucide-react";
import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div>
        <div className="font-poppins text-base font-bold text-slate-900">Welcome back</div>
        <div className="text-xs text-slate-500">Role: {user?.role}</div>
      </div>

      <Button variant="secondary" onClick={logout}>
        <LogOut size={16} />
        Logout
      </Button>
    </header>
  );
}