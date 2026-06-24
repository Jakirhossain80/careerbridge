"use client";

import { SearchBar, Select } from "@/components/ui";
import type {
  InterviewStatus,
  InterviewType,
  JobSeekerInterviewFiltersParams,
  JobSeekerInterviewPeriod,
  JobSeekerInterviewSortBy,
} from "@/types/interview.types";
import { interviewStatusLabels, interviewTypeLabels } from "@/types/interview.types";

type JobSeekerInterviewFiltersProps = {
  search: string;
  status: InterviewStatus | "all";
  interviewType: InterviewType | "all";
  period: JobSeekerInterviewPeriod;
  sortBy: JobSeekerInterviewSortBy;
  onChange: (filters: Partial<JobSeekerInterviewFiltersParams>) => void;
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

const periodOptions = [
  { label: "All interviews", value: "all" },
  { label: "Upcoming interviews", value: "upcoming" },
  { label: "Past interviews", value: "past" },
];

const sortOptions = [
  { label: "Upcoming First", value: "upcoming_first" },
  { label: "Newest Invitations", value: "newest_invitation" },
  { label: "Oldest Invitations", value: "oldest_invitation" },
];

export default function JobSeekerInterviewFilters({
  search,
  status,
  interviewType,
  period,
  sortBy,
  onChange,
}: JobSeekerInterviewFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700">
      <div className="grid gap-4 lg:grid-cols-[minmax(240px,1.4fr)_repeat(4,minmax(160px,1fr))]">
        <SearchBar
          value={search}
          onChange={(value) => onChange({ search: value })}
          placeholder="Search job title or company"
          label="Search interviews"
          className="lg:col-span-1"
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
          label="Type"
          value={interviewType}
          options={typeOptions}
          onChange={(event) =>
            onChange({
              interviewType: event.target.value as InterviewType | "all",
            })
          }
        />
        <Select
          label="Period"
          value={period}
          options={periodOptions}
          onChange={(event) =>
            onChange({ period: event.target.value as JobSeekerInterviewPeriod })
          }
        />
        <Select
          label="Sort"
          value={sortBy}
          options={sortOptions}
          onChange={(event) =>
            onChange({ sortBy: event.target.value as JobSeekerInterviewSortBy })
          }
        />
      </div>
    </section>
  );
}
