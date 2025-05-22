
import React from "react";
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { UserMenu } from "./UserMenu";

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <SidebarInset>
          <div className="flex items-center justify-between h-14 border-b px-4">
            <div className="flex items-center">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold ml-2">JurnalKas</h1>
            </div>
            <UserMenu />
          </div>
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
