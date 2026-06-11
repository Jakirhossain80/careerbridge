"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Settings,
  UserRound,
  X,
} from "lucide-react";

const dashboardLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "#", icon: UserRound },
  { label: "Jobs", href: "#", icon: BriefcaseBusiness },
  { label: "Applications", href: "#", icon: FileText },
  { label: "Notifications", href: "#", icon: Bell },
  { label: "Settings", href: "#", icon: Settings },
];

type DashboardSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

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
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-surface transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link href="/dashboard" className="font-heading text-xl font-bold">
            CareerBridge
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground lg:hidden"
            aria-label="Close dashboard menu"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Dashboard">
          {dashboardLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href !== "#" && pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Workspace
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            CareerBridge Dashboard
          </p>
        </div>
      </aside>
    </>
  );
}
