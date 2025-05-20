import React, { useState } from "react";

// Placeholder components for each admin feature
import { mockUsers, User } from "../lib/mock-users";
import { Client } from "../lib/types"; // Import the Client type

function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  function openAdd() {
    setEditingUser(null);
    setForm({ name: "", company: "", email: "", phone: "" });
    setShowModal(true);
  }

  function openEdit(user: User) { // Changed type from Client to User
    setEditingUser(user);
    setForm({
      name: user.name,
      company: user.company,
      email: user.email,
      phone: user.phone,
    });
    setShowModal(true);
  }

  function handleDelete(id: string) {
    if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...editingUser, ...form } : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          ...form,
        },
      ]);
    }
    setShowModal(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daftar Pengguna</h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={openAdd}
        >
          Tambah Pengguna
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Perusahaan</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Telepon</th>

              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.company}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.phone}</td>

                <td className="p-2 border flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(user.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400">
                  Tidak ada pengguna
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
            </h3>
            <div className="mb-2">
              <label className="block mb-1">Nama</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Perusahaan</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Email</label>
              <input
                className="w-full border rounded px-2 py-1"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Telepon</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            {/* Removed totalRevenue field as it doesn't exist in the User type */}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function SubscriptionsManagement() {
  return <div>Kelola Langganan (status, upgrade, downgrade, hapus)</div>;
}
function CustomMessage() {
  return <div>Kirim Pesan Khusus ke Pengguna</div>;
}
function UserHabits() {
  return <div>Pantau Aktivitas & Kebiasaan Pengguna</div>;
}
function Backups() {
  return <div>Backup Data & Unduh Backup</div>;
}

import {
  Users,
  CreditCard,
  Mail,
  Activity,
  Database,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const MENU = [
  { key: "users", label: "Kelola Pengguna", icon: <Users size={20} />, component: <UsersManagement /> },
  { key: "subscriptions", label: "Langganan", icon: <CreditCard size={20} />, component: <SubscriptionsManagement /> },
  { key: "message", label: "Pesan Khusus", icon: <Mail size={20} />, component: <CustomMessage /> },
  { key: "habits", label: "Kebiasaan Pengguna", icon: <Activity size={20} />, component: <UserHabits /> },
  { key: "backups", label: "Backup", icon: <Database size={20} />, component: <Backups /> },
];

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((c) => !c);
  const currentMenu = MENU.find((m) => m.key === activeMenu);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-white border-r transition-all duration-300 ${collapsed ? "w-16" : "w-64"} min-h-screen shadow-md`}
      >
        <div className="flex h-14 items-center border-b px-3 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white">AD</div>
          {!collapsed && <span className="ml-2 text-lg font-semibold">Panel Admin</span>}
          <button
            onClick={toggleSidebar}
            className={`ml-auto p-2 rounded hover:bg-purple-100 transition ${!collapsed ? "rotate-180" : ""}`}
            aria-label="Toggle sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-auto py-2">
          <div className="grid gap-1 px-2">
            {MENU.map((menu) => (
              <button
                key={menu.key}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full text-left ${
                  activeMenu === menu.key
                    ? "bg-purple-100 text-purple-900"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-900"
                } ${collapsed ? "justify-center" : ""}`}
                onClick={() => setActiveMenu(menu.key)}
              >
                <span>{menu.icon}</span>
                {!collapsed && <span>{menu.label}</span>}
              </button>
            ))}
          </div>
        </nav>
        {/* Mobile sidebar toggle */}
        <button
          className="absolute right-0 top-4 -translate-x-1/2 translate-y-1/2 md:hidden p-2 rounded hover:bg-purple-100"
          onClick={toggleSidebar}
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white rounded shadow p-8 min-h-[300px]">
          {currentMenu?.component}
        </div>
      </main>
    </div>
  );
}
