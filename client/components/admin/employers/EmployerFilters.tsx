"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminEmployerAccountStatus,
  AdminEmployerFilters,
  AdminEmployerSortBy,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";

type EmployerFiltersProps = {
  filters: Required<AdminEmployerFilters>;
  onFilterChange: <Key extends keyof AdminEmployerFilters>(
    key: Key,
    value: AdminEmployerFilters[Key],
  ) => void;
  onReset: () => void;
};

const accountStatusOptions: Array<{
  label: string;
  value: AdminEmployerAccountStatus | "all";
}> = [
  { label: "All accounts", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Blocked", value: "blocked" },
];

const verificationOptions: Array<{
  label: string;
  value: AdminEmployerVerificationStatus | "all";
}> = [
  { label: "All verification", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Pending Review", value: "pending_verification" },
  { label: "Rejected", value: "rejected" },
  { label: "Unverified", value: "unverified" },
];

const sortOptions: Array<{ label: string; value: AdminEmployerSortBy }> = [
  { label: "Newest Employers", value: "newest" },
  { label: "Oldest Employers", value: "oldest" },
  { label: "Company Name A-Z", value: "company_name_asc" },
  { label: "Company Name Z-A", value: "company_name_desc" },
  { label: "Recently Active", value: "recently_active" },
  { label: "Verification Status", value: "verification_status" },
];

export default function EmployerFilters({
  filters,
  onFilterChange,
  onReset,
}: EmployerFiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1.6fr)_repeat(7,minmax(132px,1fr))_auto]">
        <Input
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search name, company, email, industry, or website"
          aria-label="Search employers"
          className="h-11"
        />
        <Select
          aria-label="Filter employers by account status"
          value={filters.accountStatus}
          onChange={(event) =>
            onFilterChange(
              "accountStatus",
              event.target.value as AdminEmployerAccountStatus | "all",
            )
          }
          className="h-11"
          title="Prepared for backend account-status filtering."
        >
          {accountStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter employers by verification status"
          value={filters.verificationStatus}
          onChange={(event) =>
            onFilterChange(
              "verificationStatus",
              event.target.value as AdminEmployerVerificationStatus | "all",
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
        <Input
          value={filters.industry}
          onChange={(event) => onFilterChange("industry", event.target.value)}
          placeholder="Industry"
          aria-label="Filter employers by industry"
          className="h-11"
          title="Prepared for backend industry filtering."
        />
        <Input
          value={filters.companySize}
          onChange={(event) => onFilterChange("companySize", event.target.value)}
          placeholder="Company size"
          aria-label="Filter employers by company size"
          className="h-11"
          title="Prepared for backend company-size filtering."
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
          aria-label="Sort employers"
          value={filters.sortBy}
          onChange={(event) =>
            onFilterChange("sortBy", event.target.value as AdminEmployerSortBy)
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
