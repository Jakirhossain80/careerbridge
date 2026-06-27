"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchBar from "@/components/ui/SearchBar";
import Select from "@/components/ui/Select";
import type { AdminReportFilters } from "@/types/admin-report";
import {
  reportEntityTypeOptions,
  reportReasonOptions,
  reportSeverityOptions,
  reportStatusOptions,
} from "./report-formatters";

type ReportFiltersProps = {
  filters: Required<AdminReportFilters>;
  onFilterChange: <Key extends keyof AdminReportFilters>(
    key: Key,
    value: AdminReportFilters[Key],
  ) => void;
  onReset: () => void;
};

export default function ReportFilters({
  filters,
  onFilterChange,
  onReset,
}: ReportFiltersProps) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchBar
          value={filters.search}
          onChange={(value) => onFilterChange("search", value)}
          placeholder="Search reports"
          label="Search reports"
          className="xl:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onReset}>
            Clear Filters
          </Button>
          <Button
            variant="outline"
            disabled
            title="CSV export will be enabled when a backend export endpoint is available."
          >
            Export CSV
          </Button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        <Select value={filters.severity} onChange={(event) => onFilterChange("severity", event.target.value as AdminReportFilters["severity"])} aria-label="Severity">
          {reportSeverityOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(event) => onFilterChange("status", event.target.value as AdminReportFilters["status"])} aria-label="Status">
          {reportStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        <Select value={filters.reason} onChange={(event) => onFilterChange("reason", event.target.value as AdminReportFilters["reason"])} aria-label="Reason">
          {reportReasonOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        <Select value={filters.targetType} onChange={(event) => onFilterChange("targetType", event.target.value as AdminReportFilters["targetType"])} aria-label="Entity type">
          {reportEntityTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        <Input type="date" value={filters.dateFrom} onChange={(event) => onFilterChange("dateFrom", event.target.value)} aria-label="Date from" />
        <Input type="date" value={filters.dateTo} onChange={(event) => onFilterChange("dateTo", event.target.value)} aria-label="Date to" />
        <Input value={filters.reporter} onChange={(event) => onFilterChange("reporter", event.target.value)} placeholder="Reporter" aria-label="Reporter" />
      </div>
    </section>
  );
}
