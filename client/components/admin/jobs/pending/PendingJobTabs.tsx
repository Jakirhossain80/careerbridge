"use client";

import type { PendingJobQueueTab } from "@/types/admin-job.types";

type PendingJobTabsProps = {
  activeTab: PendingJobQueueTab;
  onTabChange: (tab: PendingJobQueueTab) => void;
};

const tabs: Array<{
  label: string;
  value: PendingJobQueueTab;
  description: string;
}> = [
  {
    label: "All Pending",
    value: "all",
    description: "All jobs awaiting admin review",
  },
  {
    label: "High Risk",
    value: "high_risk",
    description: "Jobs with elevated moderation signals",
  },
  {
    label: "New Employers",
    value: "new_employers",
    description: "Submissions from newly onboarded employers",
  },
  {
    label: "Updates",
    value: "updates",
    description: "Edited jobs returned to the queue",
  },
];

export default function PendingJobTabs({
  activeTab,
  onTabChange,
}: PendingJobTabsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tabs.map((tab) => {
        const active = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`rounded-lg border p-4 text-left shadow-sm transition ${
              active
                ? "border-primary bg-blue-50 text-slate-950"
                : "border-slate-200 bg-surface text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
            }`}
            aria-pressed={active}
          >
            <span className="text-sm font-semibold">{tab.label}</span>
            <span className="mt-1 block text-xs text-muted">{tab.description}</span>
          </button>
        );
      })}
    </section>
  );
}
