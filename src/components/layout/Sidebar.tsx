
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Home,
  Users,
  Briefcase,
  LogOut,
  CalendarDays,
  Settings,
  CreditCard,
  Upload,
  List,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import SidebarFeedbackWaitlist from "@/components/SidebarFeedbackWaitlist";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [manageSubscriptionOpen, setManageSubscriptionOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [renewConfirmOpen, setRenewConfirmOpen] = useState(false);

  const navItems = [
    {
      name: "Dasbor",
      icon: <Home size={20} />,
      path: "/",
    },
    {
      name: "Klien",
      icon: <Users size={20} />,
      path: "/clients",
    },
    {
      name: "Kampanye",
      icon: <Briefcase size={20} />,
      path: "/campaigns",
    },
    {
      name: "Transaksi",
      icon: <BarChart3 size={20} />,
      path: "/transactions",
    },
    {
      name: "Kategori",
      icon: <List size={20} />,
      path: "/categories",
    },
    {
      name: "Laporan",
      icon: <FileText size={20} />,
      path: "/reports",
    },
    {
      name: "Kalender",
      icon: <CalendarDays size={20} />,
      path: "/calendar",
    },
  ];

  // Mock subscription data - in a real app, this would come from your auth context or state
  const subscription = {
    active: true,
    plan: "Pro",
    expiresAt: "2025-06-20",
    daysLeft: 30, // Show days left until expiration
    paymentMethod: "Transfer Bank",
    duration: 6, // Duration in months
    pendingRenewal: false
  };

  // Mock subscription plans
  const subscriptionPlans = [
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
  ];

  // Mock payment methods
  const paymentMethods = [
    { id: 1, name: "QRIS", enabled: true },
    { id: 2, name: "Transfer Bank", enabled: true },
    { id: 3, name: "E-Wallet", enabled: false },
    { id: 4, name: "Kartu Kredit", enabled: false }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubscribe = () => {
    if (!selectedPlan || !selectedDuration || !selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Silakan pilih paket, durasi, dan metode pembayaran",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentMethod === "Transfer Bank") {
      setManageSubscriptionOpen(false);
      setUploadDialogOpen(true);
    } else {
      submitSubscription();
    }
  };

  const submitSubscription = () => {
    const plan = subscriptionPlans.find(p => p.name === selectedPlan);
    if (!plan) {
      toast({
        title: "Error",
        description: "Paket tidak ditemukan",
        variant: "destructive",
      });
      return;
    }

    const duration = plan.durations.find(d => d.months === selectedDuration);
    if (!duration) {
      toast({
        title: "Error",
        description: "Durasi tidak ditemukan",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send the data to your backend
    toast({
      title: "Success",
      description: `Permintaan berlangganan ${selectedPlan} untuk ${selectedDuration} bulan dengan ${selectedPaymentMethod} telah dikirim`,
    });
    setManageSubscriptionOpen(false);
    setUploadDialogOpen(false);
    setRenewConfirmOpen(false);
    // Reset state
    setTransferProof(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransferProof(e.target.files[0]);
    }
  };

  const handleUploadProof = () => {
    if (!transferProof) {
      toast({
        title: "Error",
        description: "Silakan unggah bukti transfer terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would upload the file to your storage
    toast({
      title: "Success",
      description: "Bukti transfer berhasil diunggah",
    });
    setUploadDialogOpen(false);
    setRenewConfirmOpen(true);
  };

  const handleManageSubscription = () => {
    if (subscription.active) {
      setSelectedPlan(subscription.plan);
      setSelectedDuration(subscription.duration);
      setSelectedPaymentMethod(subscription.paymentMethod);
    } else {
      setSelectedPlan("Pro"); // Default to Pro plan
      setSelectedDuration(6); // Default to 6 months
      setSelectedPaymentMethod("Transfer Bank"); // Default payment method
    }
    setManageSubscriptionOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login");
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white">
            JK
          </div>
          <span className="text-lg font-semibold">JurnalKas</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.name}
              >
                <Link to={item.path} className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarSeparator className="my-2" />
        
        <SidebarGroup>
          <SidebarGroupLabel>Langganan</SidebarGroupLabel>
          <div className="px-3 py-2">
            <div className={`rounded-lg border p-3 ${
              subscription.active ? 'border-green-500 bg-green-50' : 
              subscription.pendingRenewal ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {subscription.active ? subscription.plan : subscription.pendingRenewal ? 'Menunggu Persetujuan' : 'Tidak Aktif'}
                </span>
                {subscription.active && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-800">
                    Aktif
                  </span>
                )}
                {subscription.pendingRenewal && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">
                    Pending
                  </span>
                )}
              </div>
              {subscription.active && (
                <>
                  <p className="text-xs text-gray-500 mt-1">
                    Berakhir pada {subscription.expiresAt}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {subscription.daysLeft} hari tersisa
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Durasi: {subscription.duration} bulan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Metode: {subscription.paymentMethod}
                  </p>
                </>
              )}
              {subscription.pendingRenewal && (
                <p className="text-xs text-gray-500 mt-1">
                  Menunggu verifikasi pembayaran
                </p>
              )}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  className="w-full text-sm" 
                  size="sm"
                  onClick={handleManageSubscription}
                  disabled={subscription.pendingRenewal}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {subscription.active ? 'Kelola Langganan' : 'Berlangganan'}
                </Button>
              </div>
            </div>
          </div>
        </SidebarGroup>
        
        <div className="px-4 mt-4">
          <SidebarFeedbackWaitlist />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 flex gap-2">
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
          {user?.role === "admin" && (
            <Link to="/admin" className="w-full">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Settings size={18} />
                <span>Admin</span>
              </Button>
            </Link>
          )}
        </div>
      </SidebarFooter>

      {/* Dialog for managing subscriptions */}
      <Dialog open={manageSubscriptionOpen} onOpenChange={setManageSubscriptionOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Kelola Langganan</DialogTitle>
            <DialogDescription>
              Pilih paket langganan yang sesuai dengan kebutuhan Anda
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-4 shadow-sm cursor-pointer ${selectedPlan === plan.name ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <h3 className="text-lg font-bold mb-2 border-b pb-2">{plan.name}</h3>
                <div className="text-xl font-semibold">
                  {formatPrice(plan.price)}
                  <span className="text-sm font-normal">/bulan</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Duration selection */}
          {selectedPlan && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Pilih Durasi Langganan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {subscriptionPlans.find(p => p.name === selectedPlan)?.durations.map((duration) => (
                  <div 
                    key={duration.id} 
                    className={`border rounded-lg p-3 text-center cursor-pointer relative ${selectedDuration === duration.months ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => setSelectedDuration(duration.months)}
                  >
                    {duration.isPopular && (
                      <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                        Populer
                      </span>
                    )}
                    <div className="font-medium">{duration.months} bulan</div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(subscriptionPlans.find(p => p.name === selectedPlan)!.price * duration.priceMultiplier)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment method selection */}
          {selectedPlan && selectedDuration && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Pilih Metode Pembayaran</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {paymentMethods.filter(m => m.enabled).map((method) => (
                  <div 
                    key={method.id} 
                    className={`border rounded-lg p-3 text-center cursor-pointer ${selectedPaymentMethod === method.name ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => setSelectedPaymentMethod(method.name)}
                  >
                    <div className="font-medium">{method.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setManageSubscriptionOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubscribe}>
              {subscription.active ? 'Perbarui Langganan' : 'Berlangganan Sekarang'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload proof of transfer dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unggah Bukti Transfer</DialogTitle>
            <DialogDescription>
              Silakan unggah bukti transfer Anda untuk melanjutkan proses berlangganan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <Upload size={40} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Klik untuk unggah atau seret dan lepas file bukti transfer Anda
              </p>
              <input 
                type="file" 
                id="proof" 
                className="hidden" 
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="proof">
                <Button variant="outline" className="relative">
                  Pilih File
                </Button>
              </label>
              {transferProof && (
                <div className="mt-4 text-sm">
                  <span className="font-semibold">File terpilih:</span> {transferProof.name}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleUploadProof} 
              disabled={!transferProof}
            >
              Unggah dan Lanjutkan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation after upload */}
      <AlertDialog open={renewConfirmOpen} onOpenChange={setRenewConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permintaan Berlangganan Dikirim</AlertDialogTitle>
            <AlertDialogDescription>
              Terima kasih telah mengunggah bukti transfer Anda. Permintaan berlangganan sedang diproses dan akan diverifikasi oleh admin. Anda akan menerima notifikasi setelah permintaan Anda disetujui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={submitSubscription}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ShadcnSidebar>
  );
};

export default Sidebar;
