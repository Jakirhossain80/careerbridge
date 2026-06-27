"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, FileDown } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ReportFilters from "@/components/admin/reports/ReportFilters";
import ReportsByReasonChart from "@/components/admin/reports/ReportsByReasonChart";
import ReportSeverityCards from "@/components/admin/reports/ReportSeverityCards";
import ReportsTable from "@/components/admin/reports/ReportsTable";
import ReportTakeActionModal from "@/components/admin/reports/ReportTakeActionModal";
import ReportTrendsChart from "@/components/admin/reports/ReportTrendsChart";
import {
  formatReportDate,
  formatReportLabel,
  getReportEntityLabel,
  getReportEntityType,
  getReporterEmail,
  getReporterName,
  normalizeReportStatus,
} from "@/components/admin/reports/report-formatters";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import { useAdminReportAnalytics, useAdminReportMutations, useAdminReports } from "@/hooks/admin/useAdminReports";
import { getApiErrorMessage } from "@/lib/api";
import type { AdminReport, AdminReportAction, AdminReportFilters } from "@/types/admin-report";

type RequiredFilters = Required<AdminReportFilters>;

const defaultFilters: RequiredFilters = {
  search: "",
  severity: "all",
  status: "all",
  reason: "all",
  targetType: "all",
  dateFrom: "",
  dateTo: "",
  reporter: "",
  assignedModerator: "",
  page: 1,
  limit: 10,
  sortBy: "-createdAt",
};

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    severity: (searchParams.get("severity") as RequiredFilters["severity"] | null) ?? defaultFilters.severity,
    status: (searchParams.get("status") as RequiredFilters["status"] | null) ?? defaultFilters.status,
    reason: (searchParams.get("reason") as RequiredFilters["reason"] | null) ?? defaultFilters.reason,
    targetType: (searchParams.get("targetType") as RequiredFilters["targetType"] | null) ?? defaultFilters.targetType,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    reporter: searchParams.get("reporter") ?? defaultFilters.reporter,
    assignedModerator: searchParams.get("assignedModerator") ?? defaultFilters.assignedModerator,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
    sortBy: searchParams.get("sortBy") ?? defaultFilters.sortBy,
  };
}

export default function ReportsModerationView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [detailsReport, setDetailsReport] = useState<AdminReport | null>(null);
  const [actionReport, setActionReport] = useState<AdminReport | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const reportsQuery = useAdminReports(filters);
  const analyticsQuery = useAdminReportAnalytics(filters);
  const { actionMutation } = useAdminReportMutations();

  function setQueryParams(nextFilters: Partial<RequiredFilters>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...nextFilters };

    Object.entries(merged).forEach(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof RequiredFilters];

      if (value === "" || value === "all" || value === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }

  function updateFilter<Key extends keyof AdminReportFilters>(
    key: Key,
    value: AdminReportFilters[Key],
  ) {
    setSelectedReportIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedReportIds([]);
    router.replace(pathname, { scroll: false });
  }

  function submitAction(values: { action: AdminReportAction; moderatorNote?: string }) {
    if (!actionReport) return;

    actionMutation.mutate(
      {
        reportId: actionReport._id,
        action: values.action,
        moderatorNote: values.moderatorNote,
      },
      {
        onSuccess: () => {
          setActionReport(null);
          setFeedbackMessage("Moderation action completed successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error) || "Unable to complete moderation action.");
        },
      },
    );
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Reports & Moderation
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            System-wide monitoring of user activity and flagged content.
          </p>
        </div>
        <Button
          variant="outline"
          disabled
          title="CSV export will be enabled when the backend export endpoint is available."
          leftIcon={<FileDown className="size-4" aria-hidden="true" />}
        >
          Export CSV
        </Button>
      </div>

      <ReportFilters filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
      <ReportSeverityCards analytics={analyticsQuery.data} loading={analyticsQuery.isLoading} />

      {feedbackMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {feedbackMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {actionError}
        </div>
      ) : null}

      {reportsQuery.isError ? (
        <ErrorState
          title="Reports unavailable"
          message="Reports could not be loaded. Please try again."
          onRetry={() => reportsQuery.refetch()}
        />
      ) : reportsQuery.data?.reports.length === 0 && !reportsQuery.isLoading ? (
        <EmptyState
          title="No reports found"
          description="No reports match the current search and moderation filters."
        />
      ) : (
        <Card
          header={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
                <p className="mt-1 text-sm text-muted">
                  Review, investigate, and resolve complaints across the platform.
                </p>
              </div>
              {selectedReportIds.length ? (
                <span className="rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                  {selectedReportIds.length} selected
                </span>
              ) : null}
            </div>
          }
          contentClassName="p-0"
        >
          <div className="p-5">
            <ReportsTable
              reports={reportsQuery.data?.reports ?? []}
              meta={reportsQuery.data?.meta}
              loading={reportsQuery.isLoading}
              selectedReportIds={selectedReportIds}
              onSelectionChange={setSelectedReportIds}
              onPageChange={(page) => {
                setSelectedReportIds([]);
                setQueryParams({ page });
              }}
              onView={setDetailsReport}
              onTakeAction={setActionReport}
            />
          </div>
        </Card>
      )}

      {analyticsQuery.isError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          Report analytics could not be loaded.
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <ReportTrendsChart trends={analyticsQuery.data?.trends} />
          <ReportsByReasonChart reasons={analyticsQuery.data?.reasonDistribution} />
        </div>
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: report list, filters, pagination, analytics, status updates,
        resolve, dismiss, and escalate actions are connected. Account suspension,
        content removal, bulk actions, and CSV export are prepared for backend expansion.
      </footer>

      <ReportTakeActionModal
        open={Boolean(actionReport)}
        report={actionReport}
        isLoading={actionMutation.isPending}
        onClose={() => setActionReport(null)}
        onSubmit={submitAction}
      />

      <Modal
        open={Boolean(detailsReport)}
        onClose={() => setDetailsReport(null)}
        title="Report details"
        description="Investigation summary and available evidence."
        className="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setDetailsReport(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setActionReport(detailsReport);
                setDetailsReport(null);
              }}
            >
              Take Action
            </Button>
          </>
        }
      >
        {detailsReport ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {getReportEntityLabel(detailsReport)}
                </p>
                <p className="mt-1 text-sm capitalize text-muted">
                  {getReportEntityType(detailsReport)} - {formatReportLabel(detailsReport.reason)}
                </p>
              </div>
              <AdminStatusBadge status={normalizeReportStatus(detailsReport.status)} />
            </div>
            <dl className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
              <div>
                <dt className="text-muted">Reporter</dt>
                <dd className="font-medium text-foreground">{getReporterName(detailsReport)}</dd>
              </div>
              <div>
                <dt className="text-muted">Reporter email</dt>
                <dd className="font-medium text-foreground">{getReporterEmail(detailsReport)}</dd>
              </div>
              <div>
                <dt className="text-muted">Severity</dt>
                <dd className="font-medium capitalize text-foreground">{detailsReport.severity ?? "low"}</dd>
              </div>
              <div>
                <dt className="text-muted">Date</dt>
                <dd className="font-medium text-foreground">{formatReportDate(detailsReport.createdAt)}</dd>
              </div>
            </dl>
            {detailsReport.description ? (
              <p className="text-sm leading-6 text-muted">{detailsReport.description}</p>
            ) : null}
            <div>
              <h3 className="text-sm font-semibold text-foreground">Evidence</h3>
              {detailsReport.evidence?.length ? (
                <ul className="mt-2 space-y-2 text-sm text-primary">
                  {detailsReport.evidence.map((item) => (
                    <li key={item}>
                      <a href={item} target="_blank" rel="noreferrer" className="hover:underline">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">No evidence files were attached.</p>
              )}
            </div>
            {detailsReport.moderatorNote || detailsReport.resolutionNote ? (
              <div className="rounded-lg border border-slate-200 p-4 text-sm text-muted dark:border-slate-700">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
                  <p>{detailsReport.moderatorNote ?? detailsReport.resolutionNote}</p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </main>
  );
}
