"use client";

import { SearchBar, Select } from "@/components/ui";
import type {
  AnalyticsDateRange,
  EmployerAnalyticsFilters,
  TopPerformingJob,
} from "@/types/analytics.types";

type AnalyticsFiltersProps = {
  filters: EmployerAnalyticsFilters;
  search: string;
  jobs: TopPerformingJob[];
  onDateRangeChange: (dateRange: AnalyticsDateRange) => void;
  onJobChange: (jobId?: string) => void;
  onStatusChange: (status?: string) => void;
  onSearchChange: (search: string) => void;
};

const dateRangeTabs: Array<{ label: string; value: AnalyticsDateRange }> = [
  { label: "30 days", value: "last_30_days" },
  { label: "6 months", value: "six_months" },
  { label: "1 year", value: "one_year" },
  { label: "Custom", value: "custom" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export default function AnalyticsFilters({
  filters,
  search,
  jobs,
  onDateRangeChange,
  onJobChange,
  onStatusChange,
  onSearchChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" aria-label="Date range">
        {dateRangeTabs.map((tab) => {
          const isActive = filters.dateRange === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onDateRangeChange(tab.value)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search top jobs"
          label="Search analytics jobs"
          className="min-w-0"
        />
        <Select
          aria-label="Filter by job"
          value={filters.jobId ?? "all"}
          onChange={(event) =>
            onJobChange(event.target.value === "all" ? undefined : event.target.value)
          }
          options={[
            { label: "All jobs", value: "all" },
            ...jobs.map((job) => ({ label: job.title, value: job.jobId })),
          ]}
        />
        <Select
          aria-label="Filter by status"
          value={filters.status ?? "all"}
          onChange={(event) =>
            onStatusChange(
              event.target.value === "all" ? undefined : event.target.value,
            )
          }
          options={statusOptions}
        />
      </div>
    </div>
  );
}
