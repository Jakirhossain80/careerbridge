"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import type { DashboardNavItem } from "@/components/layout/DashboardSidebar";

type DashboardShellProps = {
  children: ReactNode;
  navItems?: DashboardNavItem[];
  roleLabel?: string;
  title?: string;
  searchPlaceholder?: string;
  workspaceLabel?: string;
};

export default function DashboardShell({
  children,
  navItems,
  roleLabel,
  title,
  searchPlaceholder,
  workspaceLabel,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
        roleLabel={roleLabel}
        workspaceLabel={workspaceLabel}
      />
      <div className="min-w-0 flex-1">
        <DashboardTopbar
          onMenuClick={() => setIsSidebarOpen(true)}
          title={title}
          searchPlaceholder={searchPlaceholder}
        />
        {children}
      </div>
    </div>
  );
}
