"use client";

import { Search } from "lucide-react";

import { Card, Input, Select } from "@/components/ui";
import type {
  InterviewFiltersParams,
  InterviewSortBy,
  InterviewStatus,
  InterviewType,
} from "@/types/interview.types";
import {
  interviewStatusLabels,
  interviewTypeLabels,
} from "@/types/interview.types";

type InterviewFiltersProps = {
  search: string;
  dateFrom: string;
  dateTo: string;
  jobTitle: string;
  status: InterviewStatus | "all";
  interviewType: InterviewType | "all";
  sortBy: InterviewSortBy;
  jobTitles: string[];
  onChange: (filters: Partial<InterviewFiltersParams>) => void;
};

const statusOptions = [
  { label: "All statuses", value: "all" },
  ...Object.entries(interviewStatusLabels).map(([value, label]) => ({
    label,
    value,
  })),
];

const typeOptions = [
  { label: "All types", value: "all" },
  ...Object.entries(interviewTypeLabels).map(([value, label]) => ({
    label,
    value,
  })),
];

const sortOptions = [
  { label: "Soonest first", value: "dateAsc" },
  { label: "Newest first", value: "dateDesc" },
  { label: "Candidate name", value: "candidate" },
  { label: "Job title", value: "jobTitle" },
];

export default function InterviewFilters({
  search,
  dateFrom,
  dateTo,
  jobTitle,
  status,
  interviewType,
  sortBy,
  jobTitles,
  onChange,
}: InterviewFiltersProps) {
  const jobOptions = [
    { label: "All jobs", value: "all" },
    ...jobTitles.map((title) => ({ label: title, value: title })),
  ];

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Filters</h2>
          <p className="mt-1 text-sm text-muted">
            Search and narrow interview schedules
          </p>
        </div>
      }
      contentClassName="space-y-4 p-4"
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search candidate or job title"
          aria-label="Search interviews"
          className="pl-9"
          wrapperClassName="space-y-0"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <Input
          type="date"
          label="From"
          value={dateFrom}
          onChange={(event) => onChange({ dateFrom: event.target.value })}
        />
        <Input
          type="date"
          label="To"
          value={dateTo}
          onChange={(event) => onChange({ dateTo: event.target.value })}
        />
      </div>

      <Select
        label="Job title"
        value={jobTitle}
        options={jobOptions}
        onChange={(event) => onChange({ jobTitle: event.target.value })}
      />
      <Select
        label="Status"
        value={status}
        options={statusOptions}
        onChange={(event) =>
          onChange({ status: event.target.value as InterviewStatus | "all" })
        }
      />
      <Select
        label="Interview type"
        value={interviewType}
        options={typeOptions}
        onChange={(event) =>
          onChange({
            interviewType: event.target.value as InterviewType | "all",
          })
        }
      />
      <Select
        label="Sort by"
        value={sortBy}
        options={sortOptions}
        onChange={(event) =>
          onChange({ sortBy: event.target.value as InterviewSortBy })
        }
      />
    </Card>
  );
}
