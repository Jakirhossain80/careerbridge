"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button, Input, Select } from "@/components/ui";
import type { EmployerApplicationsSortBy } from "@/types/application.types";

type JobOption = {
  label: string;
  value: string;
};

type ShortlistedApplicantsFiltersProps = {
  search: string;
  jobId: string;
  dateFrom: string;
  dateTo: string;
  sortBy: EmployerApplicationsSortBy;
  jobOptions: JobOption[];
  onSearchChange: (value: string) => void;
  onJobChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortChange: (value: EmployerApplicationsSortBy) => void;
  onClearFilters: () => void;
};

const sortOptions = [
  { label: "Best match", value: "matchScore" },
  { label: "Newest applied", value: "dateApplied" },
  { label: "Applicant name", value: "name" },
];

export default function ShortlistedApplicantsFilters({
  search,
  jobId,
  dateFrom,
  dateTo,
  sortBy,
  jobOptions,
  onSearchChange,
  onJobChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onClearFilters,
}: ShortlistedApplicantsFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Filter Status</h2>
          <p className="mt-1 text-sm text-muted">
            Narrow the shortlist by role, applied date, or match priority.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(18rem,1.4fr)_minmax(11rem,0.8fr)_minmax(9rem,0.7fr)_minmax(9rem,0.7fr)_minmax(11rem,0.8fr)]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, skill, company, location"
            aria-label="Search shortlisted applicants"
            className="h-11 pl-9"
            wrapperClassName="space-y-0"
          />
        </div>

        <Select
          value={jobId}
          onChange={(event) => onJobChange(event.target.value)}
          aria-label="Filter by job posting"
          wrapperClassName="space-y-0"
          className="h-11"
        >
          <option value="">All job postings</option>
          {jobOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          aria-label="Applied from date"
          className="h-11"
          wrapperClassName="space-y-0"
        />

        <Input
          type="date"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          aria-label="Applied to date"
          className="h-11"
          wrapperClassName="space-y-0"
        />

        <Select
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as EmployerApplicationsSortBy)
          }
          options={sortOptions}
          aria-label="Sort shortlisted applicants"
          wrapperClassName="space-y-0"
          className="h-11"
        />
      </div>
    </section>
  );
}
