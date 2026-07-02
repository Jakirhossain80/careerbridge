"use client";

import { RotateCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type {
  AdminUsersSortBy,
  UserRole,
  UserStatus,
} from "@/types/admin-user.types";

type UsersFilterBarProps = {
  search: string;
  role: UserRole | "all";
  currentAdminRole?: UserRole;
  status: UserStatus | "all";
  sortBy: AdminUsersSortBy;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | "all") => void;
  onStatusChange: (value: UserStatus | "all") => void;
  onSortChange: (value: AdminUsersSortBy) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
};

const roleOptions: Array<{ label: string; value: UserRole | "all" }> = [
  { label: "All roles", value: "all" },
  { label: "Job Seeker", value: "job_seeker" },
  { label: "Employer", value: "employer" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
];

const statusOptions: Array<{ label: string; value: UserStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Blocked", value: "blocked" },
];

const sortOptions: Array<{ label: string; value: AdminUsersSortBy }> = [
  { label: "Newest Users", value: "newest" },
  { label: "Oldest Users", value: "oldest" },
  { label: "Name A-Z", value: "name_asc" },
  { label: "Name Z-A", value: "name_desc" },
];

export default function UsersFilterBar({
  search,
  role,
  currentAdminRole,
  status,
  sortBy,
  dateFrom,
  dateTo,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: UsersFilterBarProps) {
  const visibleRoleOptions =
    currentAdminRole === "super_admin"
      ? roleOptions
      : roleOptions.filter((option) => option.value !== "super_admin");

  return (
    <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_repeat(5,minmax(140px,1fr))_auto]">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, email, or ID"
          aria-label="Search users by name, email, or ID"
          className="h-11"
        />
        <Select
          aria-label="Filter users by role"
          value={role}
          onChange={(event) => onRoleChange(event.target.value as UserRole | "all")}
          className="h-11"
        >
          {visibleRoleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter users by status"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as UserStatus | "all")
          }
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
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          aria-label="Registration date from"
          className="h-11"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          aria-label="Registration date to"
          className="h-11"
        />
        <Select
          aria-label="Sort users"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as AdminUsersSortBy)}
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
