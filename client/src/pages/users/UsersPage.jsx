import React, { useEffect, useState } from "react";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { userService } from "../../services/user.service.js";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "guest" });

  async function load() {
    const data = await userService.list();
    setUsers(data);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    await userService.create(form);
    setForm({ name: "", email: "", password: "", role: "guest" });
    await load();
  }

  async function toggleActive(u) {
    await userService.update(u._id, { isActive: !u.isActive });
    await load();
  }

  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <div className="font-poppins text-lg font-bold">User Management</div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-700">Role</div>
            <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="guest">guest</option>
              <option value="staff">staff</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <Button className="mt-4" onClick={create}>Create User</Button>
      </Card>

      <Card className="p-6">
        <div className="font-poppins text-lg font-bold">All Users</div>
        <div className="mt-4 grid gap-3">
          {users.map((u) => (
            <div key={u._id} className="flex flex-col justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center">
              <div>
                <div className="font-semibold">{u.name} <span className="text-xs text-slate-500">({u.role})</span></div>
                <div className="text-xs text-slate-600">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {u.isActive ? "active" : "inactive"}
                </div>
                <Button variant="secondary" onClick={() => toggleActive(u)}>
                  Toggle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}