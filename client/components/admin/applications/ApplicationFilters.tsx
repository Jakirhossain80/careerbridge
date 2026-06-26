"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminApplicationFilters,
  AdminApplicationsSortBy,
  AdminApplicationsTab,
  AdminApplicationStatus,
  AdminInterviewStatus,
  AdminResumeStatus,
} from "@/types/admin-application";

type ApplicationFiltersProps = {
  filters: Required<AdminApplicationFilters>;
  dense: boolean;
  onDensityChange: (dense: boolean) => void;
  onFilterChange: <Key extends keyof AdminApplicationFilters>(
    key: Key,
    value: AdminApplicationFilters[Key],
  ) => void;
  onReset: () => void;
};

const tabs: Array<{ label: string; value: AdminApplicationsTab }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Flagged", value: "flagged" },
  { label: "Advanced Filters", value: "advanced" },
];

const statusOptions: Array<{ label: string; value: AdminApplicationStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Under Review", value: "under_review" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interview Scheduled", value: "interview_scheduled" },
  { label: "Offered", value: "offered" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Flagged", value: "flagged" },
  { label: "Blocked", value: "blocked" },
];

const interviewOptions: Array<{ label: string; value: AdminInterviewStatus | "all" }> = [
  { label: "All interviews", value: "all" },
  { label: "Not Scheduled", value: "not_scheduled" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const resumeOptions: Array<{ label: string; value: AdminResumeStatus | "all" }> = [
  { label: "All resumes", value: "all" },
  { label: "Uploaded", value: "uploaded" },
  { label: "Missing", value: "missing" },
  { label: "Active", value: "active" },
];

const sortOptions: Array<{ label: string; value: AdminApplicationsSortBy }> = [
  { label: "Newest Applications", value: "newest" },
  { label: "Oldest Applications", value: "oldest" },
  { label: "Applicant Name A-Z", value: "applicant_name_asc" },
  { label: "Applicant Name Z-A", value: "applicant_name_desc" },
  { label: "Recently Updated", value: "recently_updated" },
];

export default function ApplicationFilters({
  filters,
  dense,
  onDensityChange,
  onFilterChange,
  onReset,
}: ApplicationFiltersProps) {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                filters.tab === tab.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-primary"
              }`}
              aria-pressed={filters.tab === tab.value}
              onClick={() => onFilterChange("tab", tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant={dense ? "primary" : "outline"}
          onClick={() => onDensityChange(!dense)}
          leftIcon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
        >
          {dense ? "Dense View" : "Comfort View"}
        </Button>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(280px,1.5fr)_repeat(5,minmax(140px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search applicant, email, job, company, or employer"
          aria-label="Search applications"
          className="h-11"
        />
        <Select
          value={filters.status}
          onChange={(event) =>
            onFilterChange("status", event.target.value as AdminApplicationStatus | "all")
          }
          aria-label="Filter by application status"
          className="h-11"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={filters.interviewStatus}
          onChange={(event) =>
            onFilterChange(
              "interviewStatus",
              event.target.value as AdminInterviewStatus | "all",
            )
          }
          aria-label="Filter by interview status"
          className="h-11"
        >
          {interviewOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={filters.resumeStatus}
          onChange={(event) =>
            onFilterChange("resumeStatus", event.target.value as AdminResumeStatus | "all")
          }
          aria-label="Filter by resume status"
          className="h-11"
        >
          {resumeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          value={filters.matchScore}
          onChange={(event) => onFilterChange("matchScore", event.target.value)}
          placeholder="Min score"
          aria-label="Filter by minimum match score"
          className="h-11"
        />
        <Select
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminApplicationsSortBy)
          }
          aria-label="Sort applications"
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

      {filters.tab === "advanced" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
            value={filters.job}
            onChange={(event) => onFilterChange("job", event.target.value)}
            placeholder="Job"
            aria-label="Filter by job"
            className="h-11"
          />
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onFilterChange("dateFrom", event.target.value)}
            aria-label="Applied date from"
            className="h-11"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onFilterChange("dateTo", event.target.value)}
            aria-label="Applied date to"
            className="h-11"
          />
        </div>
      ) : null}
    </section>
  );
}
