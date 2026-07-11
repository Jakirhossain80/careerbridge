"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  PlusCircle,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import DashboardLogoutButton from "@/components/layout/DashboardLogoutButton";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const dashboardLinks: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "#", icon: UserRound },
  { label: "Jobs", href: "#", icon: BriefcaseBusiness },
  { label: "Applications", href: "#", icon: FileText },
  { label: "Notifications", href: "#", icon: Bell },
  { label: "Settings", href: "#", icon: Settings },
];

export const employerDashboardLinks: DashboardNavItem[] = [
  { label: "Overview", href: "/employer/dashboard", icon: LayoutDashboard },
  {
    label: "Company Profile",
    href: "/employer/dashboard/company-profile",
    icon: Building2,
  },
  {
    label: "Post a Job",
    href: "/employer/dashboard/jobs/new",
    icon: PlusCircle,
  },
  {
    label: "Jobs",
    href: "/employer/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  { label: "Applications", href: "/employer/applicants", icon: FileText },
  { label: "Interviews", href: "/employer/interviews", icon: CalendarDays },
  { label: "Analytics", href: "/employer/analytics", icon: BarChart3 },
  { label: "Messages", href: "#", icon: MessageSquareText },
  { label: "Settings", href: "/employer/settings", icon: Settings },
];

function isActiveDashboardLink(pathname: string, link: DashboardNavItem) {
  if (link.href === "#") {
    return false;
  }

  if (link.href === "/dashboard" || link.href === "/employer/dashboard") {
    return pathname === link.href;
  }

  if (link.href === "/employer/dashboard/jobs/new") {
    return pathname === link.href;
  }

  if (link.href === "/employer/dashboard/jobs") {
    return (
      pathname === link.href ||
      (pathname.startsWith(`${link.href}/`) &&
        pathname !== "/employer/dashboard/jobs/new")
    );
  }

  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

type DashboardSidebarProps = {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  navItems?: DashboardNavItem[];
  roleLabel?: string;
  workspaceLabel?: string;
  variant?: "default" | "admin";
};

export default function DashboardSidebar({
  id,
  isOpen,
  onClose,
  navItems = dashboardLinks,
  roleLabel,
  workspaceLabel = "CareerBridge Dashboard",
  variant = "default",
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isAdmin = variant === "admin";
  const sidebarBorderClass = isAdmin
    ? "border-slate-200 dark:border-slate-700"
    : "border-slate-200";
  const inactiveLinkClass = isAdmin
    ? "text-muted hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
    : "text-muted hover:bg-background hover:text-foreground";

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        id={id}
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-40 flex max-h-screen w-72 flex-col overflow-hidden border-r transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          isAdmin ? `${sidebarBorderClass} bg-surface text-foreground` : "border-slate-200 bg-surface"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center justify-between border-b px-5 ${
            sidebarBorderClass
          }`}
        >
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight text-foreground"
            aria-label="Go to CareerBridge home page"
            onClick={onClose}
          >
            CareerBridge
          </Link>
          <button
            type="button"
            className={`rounded-md p-2 transition lg:hidden ${
              inactiveLinkClass
            }`}
            aria-label="Close dashboard menu"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-5"
          aria-label="Dashboard"
        >
          {navItems.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveDashboardLink(pathname, link);

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : isAdmin
                      ? inactiveLinkClass
                      : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div
          className={`shrink-0 border-t p-4 ${sidebarBorderClass}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {roleLabel ?? "Workspace"}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {workspaceLabel}
          </p>
          <DashboardLogoutButton variant={variant} />
        </div>
      </aside>
    </>
  );
}
