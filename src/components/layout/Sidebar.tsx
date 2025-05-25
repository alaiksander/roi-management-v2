
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
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Home,
  Users,
  Briefcase,
  LogOut,
  CalendarDays,
  Settings,
  List,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import SidebarFeedbackWaitlist from "@/components/SidebarFeedbackWaitlist";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">JurnalKas</span>
            <Badge variant="success" className="text-xs">
              Pro
            </Badge>
          </div>
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
    </ShadcnSidebar>
  );
};

export default Sidebar;
