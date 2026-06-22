"use client";

import { Search } from "lucide-react";

import { Input, Select } from "@/components/ui";
import type {
  EmployerApplicationsSortBy,
  EmployerApplicationsStatusFilter,
} from "@/types/application.types";

type ApplicantFiltersProps = {
  search: string;
  status: EmployerApplicationsStatusFilter;
  sortBy: EmployerApplicationsSortBy;
  statusCounts: Record<EmployerApplicationsStatusFilter, number>;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: EmployerApplicationsStatusFilter) => void;
  onSortChange: (value: EmployerApplicationsSortBy) => void;
};

const statusFilters: Array<{
  label: string;
  value: EmployerApplicationsStatusFilter;
}> = [
  { label: "All", value: "all" },
  { label: "New", value: "applied" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Rejected", value: "rejected" },
  { label: "Hired", value: "hired" },
];

const sortOptions = [
  { label: "Match score", value: "matchScore" },
  { label: "Date applied", value: "dateApplied" },
  { label: "Name", value: "name" },
];

export default function ApplicantFilters({
  search,
  status,
  sortBy,
  statusCounts,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: ApplicantFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search applicants, skills, or job title"
            aria-label="Search applicants"
            className="h-11 pl-9"
            wrapperClassName="space-y-0"
          />
        </div>

        <Select
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as EmployerApplicationsSortBy)
          }
          options={sortOptions}
          aria-label="Sort applicants"
          wrapperClassName="w-full space-y-0 sm:w-56"
          className="h-11"
        />
      </div>

      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        aria-label="Filter applicants by status"
      >
        {statusFilters.map((filter) => {
          const isActive = status === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
              aria-pressed={isActive}
              onClick={() => onStatusChange(filter.value)}
            >
              {filter.label}
              <span className={isActive ? "ml-2 text-blue-100" : "ml-2 text-muted"}>
                {statusCounts[filter.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
