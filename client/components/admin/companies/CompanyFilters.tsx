"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminCompanyFilters,
  AdminCompanySortBy,
  AdminCompanyStatus,
  AdminCompanyVerificationStatus,
} from "@/types/admin-company.types";

type CompanyFiltersProps = {
  filters: Required<AdminCompanyFilters>;
  onFilterChange: <Key extends keyof AdminCompanyFilters>(
    key: Key,
    value: AdminCompanyFilters[Key],
  ) => void;
  onReset: () => void;
};

const companyStatusOptions: Array<{
  label: string;
  value: AdminCompanyStatus | "all";
}> = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Blocked", value: "blocked" },
];

const verificationOptions: Array<{
  label: string;
  value: AdminCompanyVerificationStatus | "all";
}> = [
  { label: "All verification", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Pending Verification", value: "pending_verification" },
  { label: "Under Review", value: "under_review" },
  { label: "Rejected", value: "rejected" },
  { label: "Unverified", value: "unverified" },
];

const sortOptions: Array<{ label: string; value: AdminCompanySortBy }> = [
  { label: "Newest Companies", value: "newest" },
  { label: "Oldest Companies", value: "oldest" },
  { label: "Company Name A-Z", value: "company_name_asc" },
  { label: "Company Name Z-A", value: "company_name_desc" },
  { label: "Recently Updated", value: "recently_updated" },
  { label: "Most Active Companies", value: "most_active" },
];

export default function CompanyFilters({
  filters,
  onFilterChange,
  onReset,
}: CompanyFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1.6fr)_repeat(7,minmax(132px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search company, industry, website, email, or owner"
          aria-label="Search companies"
          className="h-11"
        />
        <Select
          aria-label="Filter companies by verification status"
          value={filters.verificationStatus}
          onChange={(event) =>
            onFilterChange(
              "verificationStatus",
              event.target.value as AdminCompanyVerificationStatus | "all",
            )
          }
          className="h-11"
        >
          {verificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter companies by company status"
          value={filters.companyStatus}
          onChange={(event) =>
            onFilterChange(
              "companyStatus",
              event.target.value as AdminCompanyStatus | "all",
            )
          }
          className="h-11"
        >
          {companyStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          value={filters.industry}
          onChange={(event) => onFilterChange("industry", event.target.value)}
          placeholder="Industry"
          aria-label="Filter companies by industry"
          className="h-11"
        />
        <Input
          value={filters.companySize}
          onChange={(event) => onFilterChange("companySize", event.target.value)}
          placeholder="Company size"
          aria-label="Filter companies by company size"
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
          aria-label="Sort companies"
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminCompanySortBy)
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
