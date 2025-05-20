
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
        
        <div className="px-4 mt-4">
          <SidebarFeedbackWaitlist />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
