"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminCategoryFilters,
  AdminCategorySortBy,
  AdminCategoryStatus,
} from "@/types/admin-category";

type CategoryFiltersProps = {
  filters: Required<AdminCategoryFilters>;
  onFilterChange: <Key extends keyof AdminCategoryFilters>(
    key: Key,
    value: AdminCategoryFilters[Key],
  ) => void;
  onReset: () => void;
};

const statusOptions: Array<{ label: string; value: AdminCategoryStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
  { label: "Approved", value: "approved" },
  { label: "Flagged", value: "flagged" },
];

const sortOptions: Array<{ label: string; value: AdminCategorySortBy }> = [
  { label: "Newest Categories", value: "newest" },
  { label: "Oldest Categories", value: "oldest" },
  { label: "Category Name A-Z", value: "name_asc" },
  { label: "Category Name Z-A", value: "name_desc" },
  { label: "Most Jobs", value: "most_jobs" },
  { label: "Least Jobs", value: "least_jobs" },
];

export default function CategoryFilters({
  filters,
  onFilterChange,
  onReset,
}: CategoryFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1.5fr)_repeat(5,minmax(140px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search name, slug, or description"
          aria-label="Search categories"
          className="h-11"
        />
        <Select
          value={filters.status}
          onChange={(event) =>
            onFilterChange("status", event.target.value as AdminCategoryStatus | "all")
          }
          aria-label="Filter categories by status"
          className="h-11"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
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
        <Input
          type="date"
          value={filters.updatedFrom}
          onChange={(event) => onFilterChange("updatedFrom", event.target.value)}
          aria-label="Updated date from"
          className="h-11"
        />
        <Select
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminCategorySortBy)
          }
          aria-label="Sort categories"
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
