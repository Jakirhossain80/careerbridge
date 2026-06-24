"use client";

import AdminSearchBar from "@/components/admin/AdminSearchBar";
import Select from "@/components/ui/Select";

type AdminFilterBarProps = {
  search: string;
  status?: string;
  role?: string;
  statusOptions?: Array<{ label: string; value: string }>;
  roleOptions?: Array<{ label: string; value: string }>;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onRoleChange?: (value: string) => void;
};

export default function AdminFilterBar({
  search,
  status = "",
  role = "",
  statusOptions,
  roleOptions,
  onSearchChange,
  onStatusChange,
  onRoleChange,
}: AdminFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <AdminSearchBar value={search} onChange={onSearchChange} />
      <div className="grid gap-3 sm:grid-cols-2">
        {roleOptions ? (
          <Select
            aria-label="Filter by role"
            value={role}
            onChange={(event) => onRoleChange?.(event.target.value)}
            className="h-11"
          >
            <option value="">All roles</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : null}
        {statusOptions ? (
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => onStatusChange?.(event.target.value)}
            className="h-11"
          >
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : null}
      </div>
    </div>
  );
}
