"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/lib/authRedirects";
import { appToast } from "@/lib/toast";
import { getJobSeekerProfile } from "@/services/job-seeker-profile.service";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import ActiveNavLink from "./ActiveNavLink";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "User";
  const nameParts = source
    .replace(/@.*$/, "")
    .split(/\s|[._-]/)
    .filter(Boolean);

  return nameParts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PublicNavbar() {
  const { user, profile, loading, isAuthenticated, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const jobSeekerProfileQuery = useQuery({
    queryKey: ["job-seeker-profile"],
    queryFn: getJobSeekerProfile,
    enabled: isAuthenticated && profile?.role === "job_seeker",
  });

  const jobSeekerProfile = jobSeekerProfileQuery.data;
  const displayName =
    jobSeekerProfile?.fullName ?? profile?.name ?? user?.displayName ?? user?.email ?? "User";
  const email = jobSeekerProfile?.email ?? profile?.email ?? user?.email;
  const avatarUrl = jobSeekerProfile?.avatar ?? profile?.photoURL ?? user?.photoURL;
  const initials = getInitials(displayName, email);
  const dashboardPath = getDashboardPathForRole(profile?.role) ?? "/dashboard";

  const handleLogout = async () => {
    setIsUserMenuOpen(false);

    try {
      await logout();
      appToast.success("Signed out successfully.");
    } catch {
      appToast.error("Unable to sign out. Please try again.");
    }
  };

  return (
    <header className="border-b border-slate-200 bg-surface dark:border-slate-700">
      <nav
        className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Public navigation"
      >
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-foreground"
          aria-label="Go to home page"
        >
          CareerBridge
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-muted">
          {navigationLinks.map((link) => (
            <ActiveNavLink key={link.href} href={link.href}>
              {link.label}
            </ActiveNavLink>
          ))}
          <ThemeSwitcher />
          {loading ? (
            <span
              className="size-9 animate-pulse rounded-full bg-slate-200"
              aria-label="Loading account"
            />
          ) : isAuthenticated ? (
            <>
              <Link
                href={dashboardPath}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 text-slate-700 transition hover:border-primary/40 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Open account menu"
                >
                  <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-white">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt=""
                        className="size-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : initials ? (
                      initials
                    ) : (
                      <UserRound className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <ChevronDown className="size-4" aria-hidden="true" />
                </button>

                {isUserMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 z-30 mt-0.5 w-64 rounded-md border border-slate-200 bg-white p-2 text-slate-900 shadow-lg shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                      <p className="truncate text-sm font-semibold">
                        {displayName}
                      </p>
                      {email ? (
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {email}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={dashboardPath}
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="size-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
