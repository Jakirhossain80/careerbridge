"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { LogOut, X } from "lucide-react";

import { Button } from "@/components/ui";

type DashboardRole = "job_seeker" | "employer" | "admin" | "hr_member";

type DashboardNavItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  badge?: ReactNode;
};

type DashboardSidebarProps = {
  navItems: DashboardNavItem[];
  activeHref?: string;
  role?: DashboardRole;
  roleLabel?: string;
  collapsed?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  brand?: ReactNode;
  className?: string;
};

const roleLabels: Record<DashboardRole, string> = {
  job_seeker: "Job Seeker",
  employer: "Employer",
  admin: "Admin",
  hr_member: "HR Member",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardSidebar({
  navItems,
  activeHref,
  role,
  roleLabel,
  collapsed = false,
  isOpen = true,
  onClose,
  onLogout,
  brand = "CareerBridge",
  className,
}: DashboardSidebarProps) {
  const displayRole = roleLabel ?? (role ? roleLabels[role] : undefined);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/40 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-surface text-foreground transition-all lg:static lg:z-auto lg:translate-x-0 dark:border-slate-700",
          collapsed ? "w-20" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        aria-label="Dashboard sidebar"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
          <Link
            href="/dashboard"
            className={cn(
              "min-w-0 font-heading text-xl font-bold tracking-tight text-foreground",
              collapsed && "sr-only",
            )}
          >
            {brand}
          </Link>

          {collapsed ? (
            <Link
              href="/dashboard"
              className="hidden size-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-white lg:flex"
              aria-label="CareerBridge dashboard"
            >
              CB
            </Link>
          ) : null}

          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0 lg:hidden"
              aria-label="Close dashboard menu"
              onClick={onClose}
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        {displayRole && !collapsed ? (
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase text-muted">Role</p>
            <p className="mt-1 text-sm font-medium text-foreground">{displayRole}</p>
          </div>
        ) : null}

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Dashboard">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary/30",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-background hover:text-foreground",
                )}
              >
                {Icon ? <Icon className="size-5 shrink-0" aria-hidden /> : null}
                {!collapsed ? (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? <span className="shrink-0">{item.badge}</span> : null}
                  </>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {onLogout ? (
          <div className="border-t border-slate-200 p-3 dark:border-slate-700">
            <Button
              type="button"
              variant="ghost"
              className={cn("w-full", collapsed && "px-0")}
              onClick={onLogout}
              leftIcon={<LogOut className="size-4" aria-hidden="true" />}
              aria-label={collapsed ? "Log out" : undefined}
            >
              {collapsed ? null : "Log out"}
            </Button>
          </div>
        ) : null}
      </aside>
    </>
  );
}

export type { DashboardNavItem, DashboardRole, DashboardSidebarProps };
