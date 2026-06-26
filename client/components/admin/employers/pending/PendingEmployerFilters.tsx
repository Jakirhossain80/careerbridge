"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminEmployerAccountStatus,
  AdminEmployerSortBy,
} from "@/types/admin-employer.types";
import type {
  PendingEmployerFilters,
  PendingEmployerVerificationStatus,
} from "@/types/admin-employer-verification";

type PendingEmployerFiltersProps = {
  filters: Required<PendingEmployerFilters>;
  onFilterChange: <Key extends keyof PendingEmployerFilters>(
    key: Key,
    value: PendingEmployerFilters[Key],
  ) => void;
  onReset: () => void;
};

const verificationOptions: Array<{
  label: string;
  value: PendingEmployerVerificationStatus | "all";
}> = [
  { label: "Pending verification", value: "pending_verification" },
  { label: "Under review", value: "under_review" },
  { label: "Backend pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" },
  { label: "All verification", value: "all" },
];

const accountStatusOptions: Array<{
  label: string;
  value: AdminEmployerAccountStatus | "all";
}> = [
  { label: "All accounts", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Blocked", value: "blocked" },
];

const sortOptions: Array<{ label: string; value: AdminEmployerSortBy }> = [
  { label: "Newest Submissions", value: "newest" },
  { label: "Oldest Submissions", value: "oldest" },
  { label: "Company Name A-Z", value: "company_name_asc" },
  { label: "Company Name Z-A", value: "company_name_desc" },
  { label: "Recently Submitted", value: "recently_active" },
];

export default function PendingEmployerFilters({
  filters,
  onFilterChange,
  onReset,
}: PendingEmployerFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1.5fr)_repeat(8,minmax(132px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search employer, company, email, or industry"
          aria-label="Search pending employers"
          className="h-11"
        />
        <Select
          value={filters.verificationStatus}
          onChange={(event) =>
            onFilterChange(
              "verificationStatus",
              event.target.value as PendingEmployerVerificationStatus | "all",
            )
          }
          aria-label="Filter by verification status"
          className="h-11"
        >
          {verificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={filters.accountStatus}
          onChange={(event) =>
            onFilterChange(
              "accountStatus",
              event.target.value as AdminEmployerAccountStatus | "all",
            )
          }
          aria-label="Filter by account status"
          className="h-11"
        >
          {accountStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          value={filters.industry}
          onChange={(event) => onFilterChange("industry", event.target.value)}
          placeholder="Industry"
          aria-label="Filter by industry"
          className="h-11"
        />
        <Input
          value={filters.companySize}
          onChange={(event) => onFilterChange("companySize", event.target.value)}
          placeholder="Company size"
          aria-label="Filter by company size"
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
        <Input
          type="date"
          value={filters.submittedFrom}
          onChange={(event) => onFilterChange("submittedFrom", event.target.value)}
          aria-label="Submission date from"
          className="h-11"
        />
        <Input
          type="date"
          value={filters.submittedTo}
          onChange={(event) => onFilterChange("submittedTo", event.target.value)}
          aria-label="Submission date to"
          className="h-11"
        />
        <Select
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminEmployerSortBy)
          }
          aria-label="Sort pending employers"
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
