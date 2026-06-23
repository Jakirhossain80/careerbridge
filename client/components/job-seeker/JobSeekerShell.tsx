"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

const navItems = [
  { href: "/profile", label: "Profile" },
  { href: "/profile/resumes", label: "Resumes" },
  { href: "/profile/applications", label: "Applications" },
  { href: "/profile/saved-jobs", label: "Saved jobs" },
  { href: "/profile/job-alerts", label: "Job alerts" },
];

export default function JobSeekerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Job seeker</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                Profile workspace
              </h1>
            </div>
            <nav className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/profile" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {children}
        </div>
      </main>
    </ProtectedRoute>
  );
}
