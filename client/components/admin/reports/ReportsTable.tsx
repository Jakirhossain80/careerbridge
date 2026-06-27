"use client";

import { Eye, FileSearch, MoreHorizontal, NotebookPen } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Table, { type TableColumn } from "@/components/ui/Table";
import type { AdminMeta } from "@/types/admin.types";
import type { AdminReport } from "@/types/admin-report";
import {
  formatReportDate,
  formatReportLabel,
  getReportEntityLabel,
  getReportEntityType,
  getReporterEmail,
  getReporterInitials,
  getReporterName,
  normalizeReportStatus,
} from "./report-formatters";

type ReportsTableProps = {
  reports: AdminReport[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedReportIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  onView: (report: AdminReport) => void;
  onTakeAction: (report: AdminReport) => void;
};

export default function ReportsTable({
  reports,
  meta,
  loading = false,
  selectedReportIds,
  onSelectionChange,
  onPageChange,
  onView,
  onTakeAction,
}: ReportsTableProps) {
  const allSelected = reports.length > 0 && reports.every((report) => selectedReportIds.includes(report._id));

  function toggleReport(reportId: string) {
    onSelectionChange(
      selectedReportIds.includes(reportId)
        ? selectedReportIds.filter((id) => id !== reportId)
        : [...selectedReportIds, reportId],
    );
  }

  const columns: Array<TableColumn<AdminReport>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(event) => onSelectionChange(event.target.checked ? reports.map((report) => report._id) : [])}
          aria-label="Select all reports"
          className="size-4 rounded border-slate-300"
        />
      ),
      render: (report) => (
        <input
          type="checkbox"
          checked={selectedReportIds.includes(report._id)}
          onChange={() => toggleReport(report._id)}
          aria-label={`Select report ${report._id}`}
          className="size-4 rounded border-slate-300"
        />
      ),
    },
    {
      key: "reporter",
      header: "Reporter",
      render: (report) => (
        <div className="flex items-center gap-3">
          {report.reporterAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={report.reporterAvatar} alt="" className="size-10 rounded-full object-cover" />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {getReporterInitials(report)}
            </span>
          )}
          <div>
            <p className="font-medium text-foreground">{getReporterName(report)}</p>
            <p className="text-xs text-muted">{getReporterEmail(report)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "entity",
      header: "Reported Entity",
      render: (report) => (
        <div>
          <p className="font-medium text-foreground">{getReportEntityLabel(report)}</p>
          <p className="text-xs capitalize text-muted">{getReportEntityType(report)}</p>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (report) => (
        <span className="capitalize">{formatReportLabel(report.reason)}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (report) => formatReportDate(report.createdAt),
    },
    {
      key: "status",
      header: "Status",
      render: (report) => <AdminStatusBadge status={normalizeReportStatus(report.status)} />,
    },
    {
      key: "actions",
      header: "Action",
      render: (report) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="size-9 p-0"
            onClick={() => onView(report)}
            title="View report details"
          >
            <Eye className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-9 p-0"
            onClick={() => onView(report)}
            title="Review evidence"
          >
            <FileSearch className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-9 p-0"
            onClick={() => onTakeAction(report)}
            title="Add moderator note"
          >
            <NotebookPen className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="sm"
            onClick={() => onTakeAction(report)}
            rightIcon={<MoreHorizontal className="size-4" aria-hidden="true" />}
          >
            Take Action
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={reports}
        loading={loading}
        getRowKey={(report) => report._id}
        emptyMessage="No reports match the current filters."
      />
      {meta ? (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
