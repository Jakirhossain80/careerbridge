"use client";

import type { ReactNode } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import useMobileSidebar from "@/hooks/useMobileSidebar";
import type { DashboardNavItem } from "@/components/layout/DashboardSidebar";

type DashboardShellProps = {
  children: ReactNode;
  navItems?: DashboardNavItem[];
  roleLabel?: string;
  title?: string;
  searchPlaceholder?: string;
  workspaceLabel?: string;
  sidebarVariant?: "default" | "admin";
};

export default function DashboardShell({
  children,
  navItems,
  roleLabel,
  title,
  searchPlaceholder,
  workspaceLabel,
  sidebarVariant = "default",
}: DashboardShellProps) {
  const { isOpen, closeSidebar, openSidebar } = useMobileSidebar();
  const sidebarId = "dashboard-sidebar";

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <DashboardSidebar
        id={sidebarId}
        isOpen={isOpen}
        onClose={closeSidebar}
        navItems={navItems}
        roleLabel={roleLabel}
        workspaceLabel={workspaceLabel}
        variant={sidebarVariant}
      />
      <div className="min-w-0 flex-1">
        <DashboardTopbar
          isMenuOpen={isOpen}
          menuControlsId={sidebarId}
          onMenuClick={openSidebar}
          title={title}
          searchPlaceholder={searchPlaceholder}
        />
        {children}
      </div>
    </div>
  );
}
