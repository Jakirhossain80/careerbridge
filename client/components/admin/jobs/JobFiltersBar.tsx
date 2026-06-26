"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminJobApprovalStatus,
  AdminJobFilters,
  AdminJobSortBy,
  AdminJobStatus,
  AdminJobType,
  AdminJobWorkMode,
} from "@/types/admin-job.types";

type JobFiltersBarProps = {
  filters: Required<AdminJobFilters>;
  onFilterChange: <Key extends keyof AdminJobFilters>(
    key: Key,
    value: AdminJobFilters[Key],
  ) => void;
  onReset: () => void;
};

const statusOptions: Array<{ label: string; value: AdminJobStatus | "all" }> = [
  { label: "All job statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Archived", value: "archived" },
  { label: "Closed", value: "closed" },
  { label: "Rejected", value: "rejected" },
];

const approvalOptions: Array<{
  label: string;
  value: AdminJobApprovalStatus | "all";
}> = [
  { label: "All approval", value: "all" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const jobTypeOptions: Array<{ label: string; value: AdminJobType | "all" }> = [
  { label: "All job types", value: "all" },
  { label: "Full Time", value: "full_time" },
  { label: "Part Time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Temporary", value: "temporary" },
  { label: "Freelance", value: "freelance" },
];

const workModeOptions: Array<{ label: string; value: AdminJobWorkMode | "all" }> = [
  { label: "All work modes", value: "all" },
  { label: "Remote", value: "remote" },
  { label: "Onsite", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
];

const sortOptions: Array<{ label: string; value: AdminJobSortBy }> = [
  { label: "Newest Jobs", value: "newest" },
  { label: "Oldest Jobs", value: "oldest" },
  { label: "Job Title A-Z", value: "title_asc" },
  { label: "Job Title Z-A", value: "title_desc" },
  { label: "Most Applications", value: "most_applications" },
  { label: "Least Applications", value: "least_applications" },
  { label: "Recently Updated", value: "recently_updated" },
];

export default function JobFiltersBar({
  filters,
  onFilterChange,
  onReset,
}: JobFiltersBarProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(280px,1.5fr)_repeat(5,minmax(132px,1fr))]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search title, company, employer, category, or location"
          aria-label="Search jobs"
          className="h-11"
        />
        <Select
          aria-label="Filter by job status"
          value={filters.status}
          onChange={(event) =>
            onFilterChange("status", event.target.value as AdminJobStatus | "all")
          }
          className="h-11"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by approval status"
          value={filters.approvalStatus}
          onChange={(event) =>
            onFilterChange(
              "approvalStatus",
              event.target.value as AdminJobApprovalStatus | "all",
            )
          }
          className="h-11"
        >
          {approvalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by job type"
          value={filters.jobType}
          onChange={(event) =>
            onFilterChange("jobType", event.target.value as AdminJobType | "all")
          }
          className="h-11"
        >
          {jobTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by work mode"
          value={filters.workMode}
          onChange={(event) =>
            onFilterChange(
              "workMode",
              event.target.value as AdminJobWorkMode | "all",
            )
          }
          className="h-11"
        >
          {workModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Sort jobs"
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminJobSortBy)
          }
          className="h-11"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(7,minmax(132px,1fr))_auto]">
        <Input
          value={filters.category}
          onChange={(event) => onFilterChange("category", event.target.value)}
          placeholder="Category"
          aria-label="Filter by category"
          className="h-11"
        />
        <Input
          value={filters.experienceLevel}
          onChange={(event) =>
            onFilterChange("experienceLevel", event.target.value)
          }
          placeholder="Experience"
          aria-label="Filter by experience level"
          className="h-11"
        />
        <Input
          value={filters.company}
          onChange={(event) => onFilterChange("company", event.target.value)}
          placeholder="Company"
          aria-label="Filter by company"
          className="h-11"
        />
        <Input
          value={filters.employer}
          onChange={(event) => onFilterChange("employer", event.target.value)}
          placeholder="Employer"
          aria-label="Filter by employer"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.deadlineFrom}
          onChange={(event) => onFilterChange("deadlineFrom", event.target.value)}
          aria-label="Application deadline from"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onFilterChange("dateFrom", event.target.value)}
          aria-label="Created date from"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onFilterChange("dateTo", event.target.value)}
          aria-label="Created date to"
          className="h-11"
        />
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={onReset}
          leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
