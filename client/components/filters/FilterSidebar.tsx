"use client";

import type { FormEvent } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button, Card, Input, Select } from "@/components/ui";

type FilterSidebarFilters = {
  keyword?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  experienceLevel?: string;
  salaryMin?: string;
  salaryMax?: string;
  category?: string;
};

type FilterOption = {
  label: string;
  value: string;
};

type FilterSidebarProps = {
  filters: FilterSidebarFilters;
  onChange: (filters: FilterSidebarFilters) => void;
  onApply: () => void;
  onClear: () => void;
  jobTypeOptions?: FilterOption[];
  workModeOptions?: FilterOption[];
  experienceLevelOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  showKeyword?: boolean;
  showSalaryRange?: boolean;
  showCategory?: boolean;
  className?: string;
};

const defaultJobTypeOptions: FilterOption[] = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
];

const defaultWorkModeOptions: FilterOption[] = [
  { label: "On-site", value: "on-site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

const defaultExperienceLevelOptions: FilterOption[] = [
  { label: "Entry level", value: "entry" },
  { label: "Mid level", value: "mid" },
  { label: "Senior level", value: "senior" },
  { label: "Lead / Manager", value: "lead" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function FilterSidebar({
  filters,
  onChange,
  onApply,
  onClear,
  jobTypeOptions = defaultJobTypeOptions,
  workModeOptions = defaultWorkModeOptions,
  experienceLevelOptions = defaultExperienceLevelOptions,
  categoryOptions = [],
  showKeyword = true,
  showSalaryRange = true,
  showCategory = true,
  className,
}: FilterSidebarProps) {
  function updateFilter(key: keyof FilterSidebarFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }

  const content = (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {showKeyword ? (
        <Input
          label="Keyword"
          value={filters.keyword ?? ""}
          onChange={(event) => updateFilter("keyword", event.target.value)}
          placeholder="Job title, company, or skill"
        />
      ) : null}

      <Input
        label="Location"
        value={filters.location ?? ""}
        onChange={(event) => updateFilter("location", event.target.value)}
        placeholder="City, country, or remote"
      />

      <Select
        label="Job Type"
        value={filters.jobType ?? ""}
        onChange={(event) => updateFilter("jobType", event.target.value)}
      >
        <option value="">Any job type</option>
        {jobTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        label="Work Mode"
        value={filters.workMode ?? ""}
        onChange={(event) => updateFilter("workMode", event.target.value)}
      >
        <option value="">Any work mode</option>
        {workModeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        label="Experience Level"
        value={filters.experienceLevel ?? ""}
        onChange={(event) => updateFilter("experienceLevel", event.target.value)}
      >
        <option value="">Any experience</option>
        {experienceLevelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {showSalaryRange ? (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min Salary"
            type="number"
            min="0"
            value={filters.salaryMin ?? ""}
            onChange={(event) => updateFilter("salaryMin", event.target.value)}
            placeholder="0"
          />
          <Input
            label="Max Salary"
            type="number"
            min="0"
            value={filters.salaryMax ?? ""}
            onChange={(event) => updateFilter("salaryMax", event.target.value)}
            placeholder="5000"
          />
        </div>
      ) : null}

      {showCategory ? (
        <Select
          label="Category"
          value={filters.category ?? ""}
          onChange={(event) => updateFilter("category", event.target.value)}
        >
          <option value="">Any category</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}

      <div className="grid gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-1">
        <Button type="submit">Apply Filters</Button>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </form>
  );

  return (
    <aside className={cn("w-full lg:max-w-xs", className)} aria-label="Job filters">
      <Card
        className="hidden lg:block"
        header={<h2 className="text-base font-semibold">Filters</h2>}
      >
        {content}
      </Card>

      <details className="rounded-lg border border-slate-200 bg-surface text-foreground shadow-sm lg:hidden dark:border-slate-700">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
            Filters
          </span>
          <span className="text-xs font-medium text-muted">Tap to expand</span>
        </summary>
        <div className="border-t border-slate-200 px-5 py-5 dark:border-slate-700">
          {content}
        </div>
      </details>
    </aside>
  );
}

export type { FilterOption, FilterSidebarFilters, FilterSidebarProps };
