
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { mockUsers, User } from "../lib/mock-users";
import { 
  Users, 
  CreditCard, 
  MessageSquare, 
  Activity, 
  DatabaseBackup,
  X,
  Menu,
  UserPlus,
  Search
} from "lucide-react";

// User Management Tab Content
function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function openAdd() {
    setEditingUser(null);
    setForm({ name: "", company: "", email: "", phone: "" });
    setShowModal(true);
  }

  function openEdit(user: User) {
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
      toast.success("Pengguna berhasil dihapus");
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
      toast.success("Pengguna berhasil diperbarui");
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          ...form,
        },
      ]);
      toast.success("Pengguna berhasil ditambahkan");
    }
    setShowModal(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Kelola Pengguna</CardTitle>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <UserPlus size={16} />
            Tambah Pengguna
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Cari pengguna..."
            className="pl-10 w-full border rounded-md p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-md shadow text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Nama</th>
                <th className="p-2 border text-left">Perusahaan</th>
                <th className="p-2 border text-left">Email</th>
                <th className="p-2 border text-left">Telepon</th>
                <th className="p-2 border text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.company}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.phone}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                        onClick={() => openEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8"
                        onClick={() => handleDelete(user.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-400">
                    Tidak ada pengguna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Nama</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Perusahaan</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Telepon</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

// Subscription Management Tab Content
function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState([
    { 
      id: 1, 
      name: "Basic", 
      price: 99000, 
      features: ["5 Klien", "10 Kampanye", "Laporan Bulanan"],
      durations: [
        { id: 1, months: 1, priceMultiplier: 1, isPopular: false },
        { id: 2, months: 3, priceMultiplier: 2.8, isPopular: false },
        { id: 3, months: 6, priceMultiplier: 5, isPopular: true },
        { id: 4, months: 12, priceMultiplier: 9, isPopular: false }
      ]
    },
    { 
      id: 2, 
      name: "Pro", 
      price: 199000, 
      features: ["25 Klien", "50 Kampanye", "Laporan Mingguan", "Backup Data"],
      durations: [
        { id: 1, months: 1, priceMultiplier: 1, isPopular: false },
        { id: 2, months: 3, priceMultiplier: 2.8, isPopular: false },
        { id: 3, months: 6, priceMultiplier: 5, isPopular: true },
        { id: 4, months: 12, priceMultiplier: 9, isPopular: false }
      ]
    },
    { 
      id: 3, 
      name: "Enterprise", 
      price: 499000, 
      features: ["Klien Tak Terbatas", "Kampanye Tak Terbatas", "Laporan Harian", "Backup Data", "Dukungan Prioritas"],
      durations: [
        { id: 1, months: 1, priceMultiplier: 1, isPopular: false },
        { id: 2, months: 3, priceMultiplier: 2.8, isPopular: false },
        { id: 3, months: 6, priceMultiplier: 5, isPopular: true },
        { id: 4, months: 12, priceMultiplier: 9, isPopular: false }
      ]
    }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: "QRIS", enabled: true },
    { id: 2, name: "Transfer Bank", enabled: true },
    { id: 3, name: "E-Wallet", enabled: false },
    { id: 4, name: "Kartu Kredit", enabled: false }
  ]);

  const [activeSubscriptions, setActiveSubscriptions] = useState([
    { id: 1, userId: "user-1", email: "johndoe@example.com", plan: "Pro", startDate: "2025-04-01", endDate: "2025-05-01", status: "active", duration: 1, paymentMethod: "Transfer Bank" },
    { id: 2, userId: "user-2", email: "janedoe@example.com", plan: "Basic", startDate: "2025-04-15", endDate: "2025-07-15", status: "active", duration: 3, paymentMethod: "QRIS" },
    { id: 3, userId: "user-3", email: "robertsmith@example.com", plan: "Enterprise", startDate: "2025-03-10", endDate: "2025-04-10", status: "expired", duration: 1, paymentMethod: "QRIS" }
  ]);

  const [editingDuration, setEditingDuration] = useState(null);
  const [newDuration, setNewDuration] = useState({ months: 0, priceMultiplier: 0, isPopular: false });

  const togglePaymentMethod = (id: number) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id ? {...method, enabled: !method.enabled} : method
      )
    );
    toast.success("Metode pembayaran diperbarui");
  };

  const updateSubscriptionPlan = (id: number, field: string, value: string | number) => {
    setSubscriptions(plans =>
      plans.map(plan =>
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    );
    toast.success("Paket berhasil diperbarui");
  };

  const handleSavePlan = (id: number) => {
    toast.success(`Perubahan pada paket berhasil disimpan`);
  };

  const renewSubscription = (id: number) => {
    setActiveSubscriptions(subs =>
      subs.map(sub =>
        sub.id === id ? { 
          ...sub, 
          status: "active", 
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setMonth(new Date().getMonth() + sub.duration)).toISOString().split('T')[0]
        } : sub
      )
    );
    toast.success("Langganan berhasil diperpanjang");
  };

  const cancelSubscription = (id: number) => {
    if (window.confirm("Yakin ingin membatalkan langganan ini?")) {
      setActiveSubscriptions(subs =>
        subs.map(sub =>
          sub.id === id ? { ...sub, status: "cancelled" } : sub
        )
      );
      toast.success("Langganan berhasil dibatalkan");
    }
  };

  const addDuration = (planId: number) => {
    if (newDuration.months <= 0 || newDuration.priceMultiplier <= 0) {
      toast.error("Masa berlaku dan pengali harga harus lebih dari 0");
      return;
    }

    setSubscriptions(plans =>
      plans.map(plan => {
        if (plan.id === planId) {
          const newDurationId = Math.max(...plan.durations.map(d => d.id)) + 1;
          return {
            ...plan,
            durations: [
              ...plan.durations,
              {
                id: newDurationId,
                months: newDuration.months,
                priceMultiplier: newDuration.priceMultiplier,
                isPopular: newDuration.isPopular
              }
            ]
          };
        }
        return plan;
      })
    );
    setNewDuration({ months: 0, priceMultiplier: 0, isPopular: false });
    toast.success("Durasi langganan berhasil ditambahkan");
  };

  const removeDuration = (planId: number, durationId: number) => {
    setSubscriptions(plans =>
      plans.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            durations: plan.durations.filter(d => d.id !== durationId)
          };
        }
        return plan;
      })
    );
    toast.success("Durasi langganan berhasil dihapus");
  };

  const togglePopular = (planId: number, durationId: number) => {
    setSubscriptions(plans =>
      plans.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            durations: plan.durations.map(d => ({
              ...d,
              isPopular: d.id === durationId ? !d.isPopular : false
            }))
          };
        }
        return plan;
      })
    );
    toast.success("Status popularitas berhasil diperbarui");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const extendSubscription = (id: number, additionalMonths: number) => {
    setActiveSubscriptions(subs =>
      subs.map(sub => {
        if (sub.id === id && sub.status === "active") {
          const currentEndDate = new Date(sub.endDate);
          const newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + additionalMonths));
          
          return {
            ...sub,
            endDate: newEndDate.toISOString().split('T')[0],
            duration: sub.duration + additionalMonths
          };
        }
        return sub;
      })
    );
    toast.success(`Langganan diperpanjang ${additionalMonths} bulan`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paket Langganan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptions.map(sub => (
              <div key={sub.id} className="border rounded-lg p-4 shadow-sm">
                <input 
                  className="text-lg font-bold w-full mb-2 border-b pb-2" 
                  value={sub.name} 
                  onChange={(e) => updateSubscriptionPlan(sub.id, 'name', e.target.value)}
                />
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-1">Rp</span>
                  <input 
                    className="text-xl font-semibold w-full" 
                    type="number"
                    value={sub.price} 
                    onChange={(e) => updateSubscriptionPlan(sub.id, 'price', parseInt(e.target.value))}
                  />
                  <span className="text-sm">/bulan</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {sub.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Duration options */}
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-sm font-medium mb-2">Durasi Langganan</h4>
                  <div className="space-y-2">
                    {sub.durations.map(duration => (
                      <div key={duration.id} className="flex items-center justify-between text-sm border-b pb-2">
                        <div>
                          <span className="font-medium">{duration.months} bulan</span>
                          {duration.isPopular && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                              Populer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{formatPrice(sub.price * duration.priceMultiplier)}</span>
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1"
                            onClick={() => togglePopular(sub.id, duration.id)}
                          >
                            {duration.isPopular ? "Hapus Populer" : "Set Populer"}
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 p-1"
                            onClick={() => removeDuration(sub.id, duration.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new duration */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="number"
                      placeholder="Bulan"
                      className="border rounded px-2 py-1 w-16 text-sm"
                      value={newDuration.months || ""}
                      onChange={(e) => setNewDuration({...newDuration, months: parseInt(e.target.value) || 0})}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Pengali"
                      className="border rounded px-2 py-1 w-20 text-sm"
                      value={newDuration.priceMultiplier || ""}
                      onChange={(e) => setNewDuration({...newDuration, priceMultiplier: parseFloat(e.target.value) || 0})}
                    />
                    <button
                      className="text-white bg-blue-600 hover:bg-blue-700 rounded px-2 py-1 text-sm"
                      onClick={() => addDuration(sub.id)}
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4"
                  onClick={() => handleSavePlan(sub.id)}
                >
                  Simpan Perubahan
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Metode Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map(method => (
              <div key={method.id} className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-gray-500">
                    {method.enabled ? "Aktif" : "Tidak Aktif"}
                  </p>
                </div>
                <Button 
                  variant={method.enabled ? "default" : "outline"}
                  onClick={() => togglePaymentMethod(method.id)}
                >
                  {method.enabled ? "Nonaktifkan" : "Aktifkan"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Langganan Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-md shadow text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Pengguna</th>
                  <th className="p-2 border text-left">Email</th>
                  <th className="p-2 border text-left">Paket</th>
                  <th className="p-2 border text-left">Mulai</th>
                  <th className="p-2 border text-left">Berakhir</th>
                  <th className="p-2 border text-left">Durasi</th>
                  <th className="p-2 border text-left">Pembayaran</th>
                  <th className="p-2 border text-left">Status</th>
                  <th className="p-2 border text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activeSubscriptions.map(sub => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{sub.userId}</td>
                    <td className="p-2 border">{sub.email}</td>
                    <td className="p-2 border">{sub.plan}</td>
                    <td className="p-2 border">{sub.startDate}</td>
                    <td className="p-2 border">{sub.endDate}</td>
                    <td className="p-2 border">{sub.duration} bulan</td>
                    <td className="p-2 border">{sub.paymentMethod}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' : 
                        sub.status === 'expired' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status === 'active' ? 'Aktif' : 
                         sub.status === 'expired' ? 'Kedaluwarsa' : 
                         'Dibatalkan'}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <div className="flex flex-col gap-2">
                        {sub.status !== 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 h-8 w-full"
                            onClick={() => renewSubscription(sub.id)}
                          >
                            Perpanjang
                          </Button>
                        )}
                        {sub.status === 'active' && (
                          <>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                                onClick={() => extendSubscription(sub.id, 1)}
                              >
                                +1 Bulan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                                onClick={() => extendSubscription(sub.id, 3)}
                              >
                                +3 Bulan
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8"
                              onClick={() => cancelSubscription(sub.id)}
                            >
                              Batalkan
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Message System Tab Content
function CustomMessage() {
  const [messages, setMessages] = useState([
    { id: 1, title: "Selamat Datang", content: "Terima kasih telah bergabung dengan JurnalKas!", sent: true, sentDate: "2025-05-15" },
    { id: 2, title: "Pembaruan Fitur", content: "Kami telah menambahkan fitur baru untuk laporan keuangan!", sent: false }
  ]);
  
  const [newMessage, setNewMessage] = useState({ title: "", content: "" });
  
  const handleSendMessage = () => {
    if (newMessage.title && newMessage.content) {
      setMessages([...messages, {
        id: Date.now(),
        title: newMessage.title,
        content: newMessage.content,
        sent: true,
        sentDate: new Date().toISOString().split('T')[0]
      }]);
      setNewMessage({ title: "", content: "" });
      toast.success("Pesan berhasil dikirim ke semua pengguna");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kirim Pesan ke Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Judul Pesan</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={newMessage.title}
                onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                placeholder="Masukkan judul pesan"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Isi Pesan</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 min-h-32"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                placeholder="Tulis pesan anda di sini..."
              />
            </div>
            <Button onClick={handleSendMessage} disabled={!newMessage.title || !newMessage.content}>
              Kirim ke Semua Pengguna
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Riwayat Pesan</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {messages.map(msg => (
                <div key={msg.id} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{msg.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {msg.sent ? `Terkirim ${msg.sentDate}` : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// User Habits Tab Content
function UserHabits() {
  const [activeUsers, setActiveUsers] = useState(120);
  const [totalLogins, setTotalLogins] = useState(450);
  const [avgSessionDuration, setAvgSessionDuration] = useState(15);
  const [popularFeatures, setPopularFeatures] = useState([
    { name: "Laporan Bulanan", usage: 78 },
    { name: "Manajemen Klien", usage: 65 },
    { name: "Kampanye", usage: 54 },
    { name: "Transaksi", usage: 42 }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalLogins}</div>
            <p className="text-sm text-muted-foreground">Total Login</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{avgSessionDuration} menit</div>
            <p className="text-sm text-muted-foreground">Rata-rata Durasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-sm text-muted-foreground">Kepuasan Pengguna</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fitur Populer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularFeatures.map((feature, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{feature.name}</span>
                  <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${feature.usage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 text-center">
            <p className="text-gray-500">Analitik detail akan tersedia setelah mengumpulkan data selama 30 hari</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Backup Tab Content
function Backups() {
  const [backups, setBackups] = useState([
    { id: 1, name: "Backup-2025-05-10", size: "45 MB", date: "2025-05-10", time: "13:45:20" },
    { id: 2, name: "Backup-2025-05-05", size: "42 MB", date: "2025-05-05", time: "09:30:15" },
    { id: 3, name: "Backup-2025-05-01", size: "40 MB", date: "2025-05-01", time: "00:00:00" }
  ]);
  
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const createBackup = () => {
    setIsBackingUp(true);
    
    // Simulate backup process
    setTimeout(() => {
      const newBackup = {
        id: Date.now(),
        name: `Backup-${new Date().toISOString().split('T')[0]}`,
        size: `${Math.floor(40 + Math.random() * 10)} MB`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0]
      };
      
      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
      toast.success("Backup berhasil dibuat");
    }, 2000);
  };
  
  const downloadBackup = (id: number) => {
    const backup = backups.find(b => b.id === id);
    if (backup) {
      toast.success(`Mengunduh ${backup.name}`);
    }
  };
  
  const deleteBackup = (id: number) => {
    if (window.confirm("Yakin ingin menghapus backup ini?")) {
      setBackups(backups.filter(b => b.id !== id));
      toast.success("Backup berhasil dihapus");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pengaturan Backup</CardTitle>
            <Button onClick={createBackup} disabled={isBackingUp}>
              {isBackingUp ? "Memproses..." : "Buat Backup Sekarang"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Frekuensi Backup Otomatis</label>
              <select 
                className="w-full max-w-xs border rounded-md px-3 py-2"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="never">Tidak Pernah</option>
              </select>
            </div>
            <div className="border-t pt-4">
              <label className="block mb-2 text-sm font-medium">Retensi Backup</label>
              <div className="text-sm text-gray-600">Backup akan disimpan selama 30 hari sebelum dihapus secara otomatis.</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Backup Tersedia</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Nama</th>
                <th className="text-left pb-2">Ukuran</th>
                <th className="text-left pb-2">Tanggal</th>
                <th className="text-left pb-2">Waktu</th>
                <th className="text-right pb-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(backup => (
                <tr key={backup.id} className="border-b">
                  <td className="py-3">{backup.name}</td>
                  <td>{backup.size}</td>
                  <td>{backup.date}</td>
                  <td>{backup.time}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadBackup(backup.id)}
                      >
                        Unduh
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => deleteBackup(backup.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

const ADMIN_TABS = [
  { id: "users", label: "Kelola Pengguna", icon: <Users size={18} />, component: <UsersManagement /> },
  { id: "subscriptions", label: "Langganan", icon: <CreditCard size={18} />, component: <SubscriptionsManagement /> },
  { id: "message", label: "Pesan Khusus", icon: <MessageSquare size={18} />, component: <CustomMessage /> },
  { id: "habits", label: "Aktivitas Pengguna", icon: <Activity size={18} />, component: <UserHabits /> },
  { id: "backups", label: "Backup", icon: <DatabaseBackup size={18} />, component: <Backups /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-auto">
              {ADMIN_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2"
                >
                  {tab.icon}
                  <span className="hidden lg:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="w-10">
          {/* Spacer for balanced header */}
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-card">
          <nav className="flex flex-col p-2">
            {ADMIN_TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className="justify-start mb-1"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Tabs value={activeTab}>
          {ADMIN_TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
