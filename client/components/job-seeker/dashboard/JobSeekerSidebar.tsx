"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Settings,
  UserRound,
  X,
} from "lucide-react";

const jobSeekerNavItems = [
  { label: "Dashboard", href: "/job-seeker/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/job-seeker/profile", icon: UserRound },
  { label: "Resume", href: "/job-seeker/resume-manager", icon: FileText },
  { label: "Applied Jobs", href: "/profile/applications", icon: BriefcaseBusiness },
  { label: "Saved Jobs", href: "/profile/saved-jobs", icon: Bookmark },
  { label: "Job Alerts", href: "/profile/job-alerts", icon: Bell },
  { label: "Settings", href: "/job-seeker/settings", icon: Settings },
];

type JobSeekerSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JobSeekerSidebar({
  isOpen,
  onClose,
}: JobSeekerSidebarProps) {
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
          <Link href="/job-seeker/dashboard" className="font-heading text-xl font-bold">
            CareerBridge
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground lg:hidden"
            aria-label="Close job seeker menu"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Job seeker dashboard">
          {jobSeekerNavItems.map((item) => {
            const Icon = item.icon;
            const isDashboardRoot = item.href === "/job-seeker/dashboard";
            const isActive =
              pathname === item.href ||
              (!isDashboardRoot && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Job Seeker
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Profile and applications
          </p>
        </div>
      </aside>
    </>
  );
}

export { jobSeekerNavItems };
