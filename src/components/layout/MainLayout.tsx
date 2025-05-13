
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MainLayout() {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {showSidebar && (
        <Sidebar 
          className="min-h-screen z-20"
        />
      )}
      <main className="flex flex-col flex-1 overflow-x-hidden">
        <div className="flex justify-end items-center p-2 border-b">
          <LanguageSwitcher />
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
