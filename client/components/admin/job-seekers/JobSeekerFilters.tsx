"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminJobSeekerFilters,
  AdminJobSeekerProfileCompletionFilter,
  AdminJobSeekerResumeStatus,
  AdminJobSeekerSortBy,
  AdminJobSeekerStatus,
} from "@/types/admin-job-seeker.types";

type JobSeekerFiltersProps = {
  filters: Required<AdminJobSeekerFilters>;
  onFilterChange: <Key extends keyof AdminJobSeekerFilters>(
    key: Key,
    value: AdminJobSeekerFilters[Key],
  ) => void;
  onReset: () => void;
};

const statusOptions: Array<{ label: string; value: AdminJobSeekerStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Blocked", value: "blocked" },
];

const resumeStatusOptions: Array<{
  label: string;
  value: AdminJobSeekerResumeStatus | "all";
}> = [
  { label: "All resumes", value: "all" },
  { label: "Active resume", value: "active" },
  { label: "Uploaded", value: "uploaded" },
  { label: "Processing", value: "processing" },
  { label: "Missing", value: "missing" },
];

const completionOptions: Array<{
  label: string;
  value: AdminJobSeekerProfileCompletionFilter;
}> = [
  { label: "All completion", value: "all" },
  { label: "Under 50%", value: "under_50" },
  { label: "50% - 79%", value: "50_79" },
  { label: "80% - 100%", value: "80_100" },
  { label: "Complete", value: "complete" },
  { label: "Incomplete", value: "incomplete" },
];

const sortOptions: Array<{ label: string; value: AdminJobSeekerSortBy }> = [
  { label: "Newest Job Seekers", value: "newest" },
  { label: "Oldest Job Seekers", value: "oldest" },
  { label: "Name A-Z", value: "name_asc" },
  { label: "Name Z-A", value: "name_desc" },
  { label: "Highest Profile Completion", value: "profile_completion_high" },
  { label: "Lowest Profile Completion", value: "profile_completion_low" },
];

export default function JobSeekerFilters({
  filters,
  onFilterChange,
  onReset,
}: JobSeekerFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(220px,1.5fr)_repeat(7,minmax(130px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search name, email, phone, location, or skills"
          aria-label="Search job seekers"
          className="h-11"
        />
        <Select
          aria-label="Filter job seekers by account status"
          value={filters.status}
          onChange={(event) =>
            onFilterChange("status", event.target.value as AdminJobSeekerStatus | "all")
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
          aria-label="Filter job seekers by resume status"
          value={filters.resumeStatus}
          onChange={(event) =>
            onFilterChange(
              "resumeStatus",
              event.target.value as AdminJobSeekerResumeStatus | "all",
            )
          }
          className="h-11"
        >
          {resumeStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter job seekers by profile completion"
          value={filters.profileCompletion}
          onChange={(event) =>
            onFilterChange(
              "profileCompletion",
              event.target.value as AdminJobSeekerProfileCompletionFilter,
            )
          }
          className="h-11"
        >
          {completionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          value={filters.location}
          onChange={(event) => onFilterChange("location", event.target.value)}
          placeholder="Location"
          aria-label="Filter job seekers by location"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onFilterChange("dateFrom", event.target.value)}
          aria-label="Registration date from"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onFilterChange("dateTo", event.target.value)}
          aria-label="Registration date to"
          className="h-11"
        />
        <Select
          aria-label="Sort job seekers"
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminJobSeekerSortBy)
          }
          className="h-11"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
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
