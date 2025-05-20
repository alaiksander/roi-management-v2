
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

const Sidebar = () => {
  const location = useLocation();

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
                <p className="text-xs text-gray-500 mt-1">
                  Berakhir pada {subscription.expiresAt}
                </p>
              )}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  className="w-full text-sm" 
                  size="sm"
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
    </ShadcnSidebar>
  );
};

export default Sidebar;
