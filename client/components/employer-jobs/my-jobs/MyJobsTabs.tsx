"use client";

import type { JobsTab } from "@/components/employer-jobs/my-jobs/MyPostedJobsPage";

type MyJobsTabsProps = {
  activeTab: JobsTab;
  counts: Record<JobsTab, number>;
  onTabChange: (tab: JobsTab) => void;
};

const tabs: Array<{ id: JobsTab; label: string }> = [
  { id: "all", label: "All Jobs" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "draft", label: "Drafts" },
];

export default function MyJobsTabs({
  activeTab,
  counts,
  onTabChange,
}: MyJobsTabsProps) {
  return (
    <div
      className="mt-5 flex gap-2 overflow-x-auto"
      role="tablist"
      aria-label="Job status filters"
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
              isSelected
                ? "bg-primary text-white"
                : "bg-background text-muted hover:text-foreground"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-muted"
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
