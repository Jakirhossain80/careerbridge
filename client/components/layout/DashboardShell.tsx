"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <DashboardTopbar onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </div>
    </div>
  );
}
