import { RotateCcw } from "lucide-react";

import { Button, Input, Select } from "@/components/ui";
import type { RecommendedJobsQueryParams } from "@/types/recommended-job.types";

type RecommendedJobsFiltersProps = {
  filters: RecommendedJobsQueryParams;
  onChange: (updates: Partial<RecommendedJobsQueryParams>) => void;
  onReset: () => void;
  className?: string;
};

const categoryOptions = [
  { label: "All categories", value: "" },
  { label: "Engineering", value: "Engineering" },
  { label: "Product", value: "Product" },
  { label: "Quality Assurance", value: "Quality Assurance" },
  { label: "Design", value: "Design" },
  { label: "Data", value: "Data" },
  { label: "Marketing", value: "Marketing" },
];

const employmentTypeOptions = [
  { label: "Any employment type", value: "" },
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
];

const workModeOptions = [
  { label: "Any work mode", value: "" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Onsite", value: "onsite" },
];

const experienceOptions = [
  { label: "Any experience level", value: "" },
  { label: "Entry level", value: "Entry level" },
  { label: "Mid level", value: "Mid level" },
  { label: "Senior level", value: "Senior level" },
  { label: "Lead / Manager", value: "Lead / Manager" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function RecommendedJobsFilters({
  filters,
  onChange,
  onReset,
  className,
}: RecommendedJobsFiltersProps) {
  return (
    <aside
      className={cn(
        "rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700",
        className,
      )}
      aria-labelledby="recommended-jobs-filters-heading"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="recommended-jobs-filters-heading" className="text-base font-semibold">
          Filters
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
        >
          Reset
        </Button>
      </div>

      <div className="mt-5 grid gap-4">
        <Select
          label="Job Category"
          value={filters.category ?? ""}
          onChange={(event) => onChange({ category: event.target.value })}
          options={categoryOptions}
        />
        <Input
          label="Location"
          value={filters.location ?? ""}
          placeholder="City, country, or remote"
          onChange={(event) => onChange({ location: event.target.value })}
        />
        <Select
          label="Employment Type"
          value={filters.employmentType ?? ""}
          onChange={(event) => onChange({ employmentType: event.target.value })}
          options={employmentTypeOptions}
        />
        <Select
          label="Work Mode"
          value={filters.workMode ?? ""}
          onChange={(event) =>
            onChange({
              workMode: event.target.value as RecommendedJobsQueryParams["workMode"],
            })
          }
          options={workModeOptions}
        />
        <Select
          label="Experience Level"
          value={filters.experienceLevel ?? ""}
          onChange={(event) => onChange({ experienceLevel: event.target.value })}
          options={experienceOptions}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Input
            label="Salary Min"
            type="number"
            min={0}
            value={filters.salaryMin ?? ""}
            onChange={(event) =>
              onChange({
                salaryMin: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
          />
          <Input
            label="Salary Max"
            type="number"
            min={0}
            value={filters.salaryMax ?? ""}
            onChange={(event) =>
              onChange({
                salaryMax: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
          />
        </div>
      </div>
    </aside>
  );
}
