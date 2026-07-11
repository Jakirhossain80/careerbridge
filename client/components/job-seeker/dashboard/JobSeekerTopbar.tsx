"use client";

import Link from "next/link";
import { Bell, Menu, Upload } from "lucide-react";

import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { SearchBar } from "@/components/ui";

type JobSeekerTopbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  isMenuOpen?: boolean;
  menuControlsId?: string;
};

export default function JobSeekerTopbar({
  search,
  onSearchChange,
  onMenuClick,
  isMenuOpen = false,
  menuControlsId,
}: JobSeekerTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/95 backdrop-blur dark:border-slate-700">
      <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground lg:hidden"
            aria-label="Open job seeker menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuControlsId}
            onClick={onMenuClick}
          >
            <Menu size={21} aria-hidden="true" />
          </button>
          <div>
            <p className="text-sm text-muted">Job Seeker</p>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search jobs or companies"
            label="Search dashboard"
            className="w-full sm:w-80"
          />
          <div className="flex items-center gap-2">
            <Link
              href="/job-seeker/notifications"
              className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="View notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </Link>
            <ThemeSwitcher />
            <Link
              href="/job-seeker/resume-manager"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700"
            >
              <Upload className="size-4" aria-hidden="true" />
                Upload Resume
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
