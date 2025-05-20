
import React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
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
  LogOut,
  CreditCard,
  MessageSquare,
  Activity,
  DatabaseBackup,
} from "lucide-react";

const AdminSidebar = () => {
  const navItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/",
    },
    {
      name: "Kelola Pengguna",
      icon: <Users size={20} />,
      path: "/admin",
    },
    {
      name: "Langganan",
      icon: <CreditCard size={20} />,
      path: "/admin?tab=subscriptions",
    },
    {
      name: "Pesan Khusus", 
      icon: <MessageSquare size={20} />,
      path: "/admin?tab=message",
    },
    {
      name: "Aktivitas Pengguna",
      icon: <Activity size={20} />,
      path: "/admin?tab=habits",
    },
    {
      name: "Backup Data",
      icon: <DatabaseBackup size={20} />,
      path: "/admin?tab=backups",
    },
    {
      name: "Laporan",
      icon: <FileText size={20} />,
      path: "/reports",
    },
    {
      name: "Transaksi",
      icon: <BarChart3 size={20} />,
      path: "/transactions",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white">
            AD
          </div>
          <span className="text-lg font-semibold">Admin Panel</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
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
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
