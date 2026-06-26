"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminBlogFeaturedStatus,
  AdminBlogFilters,
  AdminBlogSortBy,
  AdminBlogStatus,
} from "@/types/admin-blog";

type BlogFiltersProps = {
  filters: Required<AdminBlogFilters>;
  onFilterChange: <Key extends keyof AdminBlogFilters>(
    key: Key,
    value: AdminBlogFilters[Key],
  ) => void;
  onReset: () => void;
};

const statusOptions: Array<{ label: string; value: AdminBlogStatus | "all" }> = [
  { label: "All Content", value: "all" },
  { label: "Drafts", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Unpublished", value: "unpublished" },
  { label: "Archived", value: "archived" },
];

const featuredOptions: Array<{
  label: string;
  value: AdminBlogFeaturedStatus | "all";
}> = [
  { label: "All featured", value: "all" },
  { label: "Featured", value: "featured" },
  { label: "Not Featured", value: "not_featured" },
];

const sortOptions: Array<{ label: string; value: AdminBlogSortBy }> = [
  { label: "Newest Blogs", value: "newest" },
  { label: "Oldest Blogs", value: "oldest" },
  { label: "Blog Title A-Z", value: "title_asc" },
  { label: "Blog Title Z-A", value: "title_desc" },
  { label: "Most Viewed", value: "most_viewed" },
  { label: "Recently Updated", value: "recently_updated" },
];

export default function BlogFilters({ filters, onFilterChange, onReset }: BlogFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1.5fr)_repeat(6,minmax(130px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search title, author, category, tags, or slug"
          aria-label="Search blogs"
          className="h-11"
        />
        <Select
          value={filters.status}
          onChange={(event) =>
            onFilterChange("status", event.target.value as AdminBlogStatus | "all")
          }
          aria-label="Filter by publication status"
          className="h-11"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={filters.featuredStatus}
          onChange={(event) =>
            onFilterChange(
              "featuredStatus",
              event.target.value as AdminBlogFeaturedStatus | "all",
            )
          }
          aria-label="Filter by featured status"
          className="h-11"
        >
          {featuredOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          value={filters.category}
          onChange={(event) => onFilterChange("category", event.target.value)}
          placeholder="Category"
          aria-label="Filter by category"
          className="h-11"
        />
        <Input
          value={filters.author}
          onChange={(event) => onFilterChange("author", event.target.value)}
          placeholder="Author"
          aria-label="Filter by author"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onFilterChange("dateFrom", event.target.value)}
          aria-label="Published date from"
          className="h-11"
        />
        <Select
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminBlogSortBy)
          }
          aria-label="Sort blogs"
          className="h-11"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Button type="button" variant="outline" className="h-11" onClick={onReset} leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}>
          Reset
        </Button>
      </div>
    </section>
  );
}
