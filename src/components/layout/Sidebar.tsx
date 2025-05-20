
import React from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import SidebarFeedbackWaitlist from "@/components/SidebarFeedbackWaitlist";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

const Sidebar = () => {
  const location = useLocation();
  const [manageSubscriptionOpen, setManageSubscriptionOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

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
      toast.error("Silakan pilih paket, durasi, dan metode pembayaran");
      return;
    }

    const plan = subscriptionPlans.find(p => p.name === selectedPlan);
    if (!plan) {
      toast.error("Paket tidak ditemukan");
      return;
    }

    const duration = plan.durations.find(d => d.months === selectedDuration);
    if (!duration) {
      toast.error("Durasi tidak ditemukan");
      return;
    }

    // In a real app, this would initiate a payment process
    toast.success(`Berlangganan ${selectedPlan} untuk ${selectedDuration} bulan dengan ${selectedPaymentMethod}`);
    setManageSubscriptionOpen(false);
    setPaymentMethodOpen(false);
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
            <div className={`rounded-lg border p-3 ${subscription.active ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">{subscription.active ? subscription.plan : 'Tidak Aktif'}</span>
                {subscription.active && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-800">
                    Aktif
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
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  className="w-full text-sm" 
                  size="sm"
                  onClick={handleManageSubscription}
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
          <Button variant="outline" className="w-full flex items-center gap-2">
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
          <Link to="/admin" className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Settings size={18} />
              <span>Admin</span>
            </Button>
          </Link>
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
    </ShadcnSidebar>
  );
};

export default Sidebar;
