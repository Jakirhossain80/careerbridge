"use client";

import type { AdminUsersTab } from "@/types/admin-user.types";

type UsersTabsProps = {
  activeTab: AdminUsersTab;
  onTabChange: (tab: AdminUsersTab) => void;
};

const tabs: Array<{ label: string; value: AdminUsersTab }> = [
  { label: "All Users", value: "all" },
  { label: "Job Seekers", value: "job_seekers" },
  { label: "Employers", value: "employers" },
  { label: "Admins", value: "admins" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function UsersTabs({ activeTab, onTabChange }: UsersTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className="inline-flex min-w-full gap-1 rounded-lg border border-slate-200 bg-surface p-1 shadow-sm sm:min-w-0"
        role="tablist"
        aria-label="User categories"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                "h-10 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
              onClick={() => onTabChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
