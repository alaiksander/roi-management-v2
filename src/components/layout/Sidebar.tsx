
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Home,
  Users,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  LogOut,
  CalendarDays,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/",
    },
    {
      name: "Clients",
      icon: <Users size={20} />,
      path: "/clients",
    },
    {
      name: "Campaigns",
      icon: <Briefcase size={20} />,
      path: "/campaigns",
    },
    {
      name: "Transactions",
      icon: <BarChart3 size={20} />,
      path: "/transactions",
    },
    {
      name: "Reports",
      icon: <FileText size={20} />,
      path: "/reports",
    },
    {
      name: "Calendar",
      icon: <CalendarDays size={20} />,
      path: "/calendar",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col bg-white border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-3 py-4">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 font-semibold",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white">
            MF
          </div>
          {!collapsed && <span className="text-lg">MarketFinance</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("ml-auto", !collapsed && "rotate-180")}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className={cn(
            "flex w-full items-center gap-2",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-4 -translate-x-1/2 translate-y-1/2 md:hidden"
        onClick={toggleSidebar}
      >
        {collapsed ? <Menu size={16} /> : <X size={16} />}
      </Button>
    </div>
  );
};

export default Sidebar;
