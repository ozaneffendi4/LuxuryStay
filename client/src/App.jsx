import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import RoleGate from "./components/routing/RoleGate.jsx";
import AppShell from "./components/layout/AppShell.jsx";

import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard.jsx";
import StaffDashboard from "./pages/dashboards/StaffDashboard.jsx";
import GuestDashboard from "./pages/dashboards/GuestDashboard.jsx";

import RoomsList from "./pages/rooms/RoomsList.jsx";
import BookRoom from "./pages/bookings/BookRoom.jsx";
import BookingHistory from "./pages/bookings/BookingHistory.jsx";
import ManageBookings from "./pages/bookings/ManageBookings.jsx";
import UsersPage from "./pages/users/UsersPage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";
import LogsPage from "./pages/LogsPage.jsx";

import { useAuth } from "./hooks/useAuth.js";
import { DASHBOARD_PATH } from "./utils/constants.js";

function AppHomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={DASHBOARD_PATH[user.role]} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppHomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<AppHomeRedirect />} />

                <Route path="admin" element={<RoleGate allow={["admin"]}><AdminDashboard /></RoleGate>} />
                <Route path="manager" element={<RoleGate allow={["manager"]}><ManagerDashboard /></RoleGate>} />
                <Route path="staff" element={<RoleGate allow={["staff"]}><StaffDashboard /></RoleGate>} />
                <Route path="guest" element={<RoleGate allow={["guest"]}><GuestDashboard /></RoleGate>} />

                <Route path="rooms" element={<RoomsList />} />
                <Route path="book-room" element={<RoleGate allow={["guest", "admin"]}><BookRoom /></RoleGate>} />
                <Route path="history" element={<RoleGate allow={["guest"]}><BookingHistory /></RoleGate>} />

                <Route path="bookings" element={<RoleGate allow={["admin", "manager", "staff"]}><ManageBookings /></RoleGate>} />

                <Route path="users" element={<RoleGate allow={["admin"]}><UsersPage /></RoleGate>} />
                <Route path="settings" element={<RoleGate allow={["admin"]}><SettingsPage /></RoleGate>} />
                <Route path="logs" element={<RoleGate allow={["admin"]}><LogsPage /></RoleGate>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}