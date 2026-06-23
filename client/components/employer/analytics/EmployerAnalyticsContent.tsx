"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import AnalyticsFilters from "@/components/employer/analytics/AnalyticsFilters";
import AnalyticsPromoCards from "@/components/employer/analytics/AnalyticsPromoCards";
import AnalyticsSummaryCards from "@/components/employer/analytics/AnalyticsSummaryCards";
import ApplicationTrendsChart from "@/components/employer/analytics/ApplicationTrendsChart";
import JobsByCategoryChart from "@/components/employer/analytics/JobsByCategoryChart";
import RecruitmentFunnelChart from "@/components/employer/analytics/RecruitmentFunnelChart";
import TopPerformingJobsTable from "@/components/employer/analytics/TopPerformingJobsTable";
import { Button, Card, EmptyState } from "@/components/ui";
import {
  exportEmployerAnalyticsCsv,
  getEmployerAnalytics,
} from "@/services/analytics.service";
import type {
  AnalyticsDateRange,
  EmployerAnalyticsFilters,
  EmployerAnalyticsOverview,
  TopPerformingJob,
} from "@/types/analytics.types";

function AnalyticsLoadingState() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>
      <p className="sr-only">Loading analytics...</p>
    </div>
  );
}

function hasAnalyticsData(data?: EmployerAnalyticsOverview) {
  return Boolean(
    data &&
      (data.metrics.length > 0 ||
        data.applicationTrends.length > 0 ||
        data.jobsByCategory.length > 0 ||
        data.topPerformingJobs.length > 0),
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildLocalCsv(jobs: TopPerformingJob[]) {
  const headers = [
    "Job ID",
    "Title",
    "Category",
    "Work Mode",
    "Status",
    "Views",
    "Applications",
    "Conversion Rate",
  ];
  const rows = jobs.map((job) => [
    job.jobId,
    job.title,
    job.category,
    job.workMode ?? "",
    job.status,
    String(job.totalViews),
    String(job.applications),
    `${job.conversionRate}%`,
  ]);

  return [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
}

export default function EmployerAnalyticsContent() {
  const [dateRange, setDateRange] =
    useState<AnalyticsDateRange>("last_30_days");
  const [jobFilter, setJobFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const filters = useMemo<EmployerAnalyticsFilters>(
    () => ({
      dateRange,
      jobId: jobFilter,
      status: statusFilter,
      search: search.trim() || undefined,
    }),
    [dateRange, jobFilter, search, statusFilter],
  );

  const analyticsQuery = useQuery({
    queryKey: ["employer-analytics", filters],
    queryFn: () => getEmployerAnalytics(filters),
    placeholderData: (previousData) => previousData,
  });

  const analytics = analyticsQuery.data;
  const topPerformingJobs = analytics?.topPerformingJobs ?? [];

  async function handleExportCsv() {
    if (!analytics || topPerformingJobs.length === 0) {
      return;
    }

    setIsExporting(true);

    try {
      const blob = await exportEmployerAnalyticsCsv(filters);
      downloadBlob(blob, "careerbridge-employer-analytics.csv");
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw error;
      }

      const csv = buildLocalCsv(topPerformingJobs);
      downloadBlob(
        new Blob([csv], { type: "text/csv;charset=utf-8" }),
        "careerbridge-employer-analytics.csv",
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Employer Analytics
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Employer Analytics
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Monitor job posting performance, applicant activity, funnel health,
              interview progress, and hiring effectiveness from one workspace.
            </p>
          </div>

          <Button
            type="button"
            className="w-full sm:w-auto"
            leftIcon={<Download className="size-4" aria-hidden="true" />}
            onClick={handleExportCsv}
            disabled={!analytics || topPerformingJobs.length === 0}
            isLoading={isExporting}
          >
            Export CSV
          </Button>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
          <AnalyticsFilters
            filters={filters}
            search={search}
            jobs={analytics?.topPerformingJobs ?? []}
            onDateRangeChange={setDateRange}
            onJobChange={setJobFilter}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearch}
          />
        </div>
      </header>

      {analyticsQuery.isLoading ? (
        <AnalyticsLoadingState />
      ) : analyticsQuery.isError ? (
        <Card contentClassName="p-6 text-center">
          <h2 className="font-semibold text-red-700">
            Unable to load analytics data. Please try again.
          </h2>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => analyticsQuery.refetch()}
          >
            Retry
          </Button>
        </Card>
      ) : !hasAnalyticsData(analytics) ? (
        <EmptyState
          title="No analytics data available yet."
          description="Analytics will appear after your jobs receive views, applications, and hiring activity."
        />
      ) : analytics ? (
        <>
          <AnalyticsSummaryCards metrics={analytics.metrics} />

          <div className="grid gap-6 xl:grid-cols-2">
            <ApplicationTrendsChart data={analytics.applicationTrends} />
            <JobsByCategoryChart data={analytics.jobsByCategory} />
          </div>

          {analytics.recruitmentFunnel ? (
            <RecruitmentFunnelChart data={analytics.recruitmentFunnel} />
          ) : null}

          <TopPerformingJobsTable jobs={topPerformingJobs} />
          <AnalyticsPromoCards />
        </>
      ) : null}
    </div>
  );
}
