import { SlidersHorizontal } from "lucide-react";

import { Button, Select } from "@/components/ui";
import type { RecommendedJobsSortBy } from "@/types/recommended-job.types";

type RecommendedJobsHeaderProps = {
  total: number;
  sortBy: RecommendedJobsSortBy;
  onSortChange: (value: RecommendedJobsSortBy) => void;
  onToggleFilters: () => void;
};

const sortOptions = [
  { label: "Sort by Match", value: "relevance" },
  { label: "Newest First", value: "newest" },
  { label: "Salary High to Low", value: "salary_high" },
  { label: "Salary Low to High", value: "salary_low" },
];

export default function RecommendedJobsHeader({
  total,
  sortBy,
  onSortChange,
  onToggleFilters,
}: RecommendedJobsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Based on your Profile
        </h1>
        <p className="mt-2 text-sm text-muted">
          {total} matched {total === 1 ? "opportunity" : "opportunities"} from
          your skills, preferences, saved jobs, and application history.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onToggleFilters}
          leftIcon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
          className="lg:hidden"
        >
          Filters
        </Button>
        <Select
          aria-label="Sort recommended jobs"
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as RecommendedJobsSortBy)
          }
          options={sortOptions}
          wrapperClassName="min-w-56"
        />
      </div>
    </div>
  );
}
