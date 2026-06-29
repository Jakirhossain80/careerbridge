"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  Newspaper,
  PieChart,
  Search,
  TrendingUp,
  UserRoundSearch,
  Users,
  X,
} from "lucide-react";
import {
  Area as RechartsArea,
  AreaChart as RechartsAreaChart,
  Bar as RechartsBar,
  BarChart as RechartsBarChart,
  CartesianGrid as RechartsCartesianGrid,
  Cell as RechartsCell,
  Pie as RechartsPie,
  PieChart as RechartsPieChart,
  ResponsiveContainer as RechartsResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
} from "recharts";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { DashboardEmptyState } from "@/components/empty-states";
import { WidgetErrorBoundary } from "@/components/errors";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Pagination from "@/components/ui/Pagination";
import Table, { type TableColumn } from "@/components/ui/Table";
import { useAdminAnalyticsOverview } from "@/hooks/admin/useAdminAnalytics";
import type {
  AdminAnalyticsCategoryRow,
  AdminAnalyticsCompanyRow,
  AdminAnalyticsDateRange,
  AdminAnalyticsFilters,
  AdminAnalyticsOverview,
} from "@/types/analytics.types";

const dateRangeOptions: Array<{ label: string; value: AdminAnalyticsDateRange }> = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 90 Days", value: "last_90_days" },
  { label: "Last 12 Months", value: "last_12_months" },
  { label: "Custom Range", value: "custom" },
];

const metricIcons = {
  totalUsers: Users,
  totalJobSeekers: UserRoundSearch,
  totalEmployers: Building2,
  totalCompanies: Building2,
  totalJobs: BriefcaseBusiness,
  activeJobs: TrendingUp,
  totalApplications: FileText,
  totalInterviews: Search,
  totalBlogs: Newspaper,
  totalCategories: PieChart,
};

const chartColors = ["#2563eb", "#10b981", "#6366f1", "#f59e0b", "#ef4444", "#14b8a6"];

const defaultFilters: AdminAnalyticsFilters = {
  dateRange: "last_30_days",
  dateFrom: "",
  dateTo: "",
  category: "",
  company: "",
  employer: "",
  location: "",
};

function readFilters(searchParams: URLSearchParams): AdminAnalyticsFilters {
  return {
    dateRange:
      (searchParams.get("dateRange") as AdminAnalyticsDateRange | null) ??
      defaultFilters.dateRange,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    category: searchParams.get("category") ?? defaultFilters.category,
    company: searchParams.get("company") ?? defaultFilters.company,
    employer: searchParams.get("employer") ?? defaultFilters.employer,
    location: searchParams.get("location") ?? defaultFilters.location,
  };
}

function metricTone(index: number) {
  return (["primary", "secondary", "tertiary", "neutral"] as const)[index % 4];
}

function AnalyticsTablePagination({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return total > 5 ? (
    <Pagination
      currentPage={page}
      totalPages={Math.ceil(total / 5)}
      onPageChange={onPageChange}
      className="mt-4"
    />
  ) : null;
}

function TrendChart({ data }: { data: AdminAnalyticsOverview["trends"] }) {
  return (
    <DashboardSection
      title="Growth Analytics"
      description="User, employer, company, job, application, interview, and blog activity over the selected period."
      action={<TrendingUp className="size-5 text-primary" aria-hidden="true" />}
    >
      {data.length === 0 ? (
        <DashboardEmptyState
          title="No growth data available"
          description="Growth trends will appear when activity is recorded for this period."
        />
      ) : (
      <div className="h-80">
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <RechartsCartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <RechartsXAxis dataKey="label" tickLine={false} axisLine={false} />
            <RechartsYAxis tickLine={false} axisLine={false} />
            <RechartsTooltip />
            <RechartsArea type="monotone" dataKey="users" name="Users" stroke="#2563eb" fill="#dbeafe" />
            <RechartsArea type="monotone" dataKey="jobs" name="Jobs" stroke="#10b981" fill="#d1fae5" />
            <RechartsArea type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" fill="#e0e7ff" />
          </RechartsAreaChart>
        </RechartsResponsiveContainer>
      </div>
      )}
    </DashboardSection>
  );
}

function CategoryDistributionChart({
  data,
}: {
  data: AdminAnalyticsOverview["categoryDistribution"];
}) {
  return (
    <DashboardSection
      title="Category Distribution"
      description="Share of job postings by category."
      action={<PieChart className="size-5 text-primary" aria-hidden="true" />}
    >
      {data.length === 0 ? (
        <DashboardEmptyState
          title="No category distribution available"
          description="Category distribution will appear after jobs are categorized."
        />
      ) : (
      <>
      <div className="h-80">
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <RechartsTooltip />
            <RechartsPie data={data} dataKey="count" nameKey="label" innerRadius={58} outerRadius={104} paddingAngle={2}>
              {data.map((entry, index) => (
                <RechartsCell key={entry.label} fill={chartColors[index % chartColors.length]} />
              ))}
            </RechartsPie>
          </RechartsPieChart>
        </RechartsResponsiveContainer>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
              {item.label}
            </span>
            <span className="text-muted">{item.percentage}%</span>
          </div>
        ))}
      </div>
      </>
      )}
    </DashboardSection>
  );
}

function HiringFunnel({ data }: { data: AdminAnalyticsOverview["hiringFunnel"] }) {
  return (
    <DashboardSection
      title="Hiring Funnel"
      description="Candidate movement from submitted applications to completed hires."
      action={<BarChart3 className="size-5 text-primary" aria-hidden="true" />}
    >
      {data.length === 0 ? (
        <DashboardEmptyState
          title="No hiring funnel data available"
          description="Funnel stages will appear when applications move through hiring."
        />
      ) : (
      <div className="space-y-4">
        {data.map((stage) => (
          <div key={stage.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="text-muted">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.min(Math.max(stage.percentage, 4), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </DashboardSection>
  );
}

function LocationChart({ data }: { data: AdminAnalyticsOverview["locationDistribution"] }) {
  return (
    <DashboardSection
      title="Top Locations"
      description="Job posting concentration by location."
    >
      {data.length === 0 ? (
        <DashboardEmptyState
          title="No location data available"
          description="Location analytics will appear after jobs include locations."
        />
      ) : (
      <div className="h-80">
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
            <RechartsCartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <RechartsXAxis type="number" tickLine={false} axisLine={false} />
            <RechartsYAxis type="category" dataKey="label" width={96} tickLine={false} axisLine={false} />
            <RechartsTooltip />
            <RechartsBar dataKey="count" name="Jobs" fill="#10b981" radius={[0, 6, 6, 0]} />
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </div>
      )}
    </DashboardSection>
  );
}

export default function AdminAnalyticsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const analyticsQuery = useAdminAnalyticsOverview(filters);
  const categoryPage = Number(searchParams.get("categoryPage") ?? 1);
  const companyPage = Number(searchParams.get("companyPage") ?? 1);

  function updateFilters(nextFilters: Partial<AdminAnalyticsFilters> & Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...nextFilters };

    Object.entries(merged).forEach(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof AdminAnalyticsFilters];

      if (!value || value === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete("categoryPage");
    params.delete("companyPage");
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  }

  function setPage(key: "categoryPage" | "companyPage", page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete(key);
    } else {
      params.set(key, String(page));
    }
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  }

  const data = analyticsQuery.data;
  const topCategories = data?.topCategories.slice((categoryPage - 1) * 5, categoryPage * 5) ?? [];
  const topCompanies = data?.topCompanies.slice((companyPage - 1) * 5, companyPage * 5) ?? [];

  const categoryColumns: Array<TableColumn<AdminAnalyticsCategoryRow>> = [
    { key: "category", header: "Category", accessor: "category" },
    { key: "jobs", header: "Jobs", render: (item) => item.jobs.toLocaleString() },
    { key: "activeJobs", header: "Active", render: (item) => item.activeJobs.toLocaleString() },
    { key: "applications", header: "Applications", render: (item) => item.applications.toLocaleString() },
    { key: "companies", header: "Companies", render: (item) => item.companies.toLocaleString() },
  ];

  const companyColumns: Array<TableColumn<AdminAnalyticsCompanyRow>> = [
    { key: "company", header: "Company", accessor: "company" },
    { key: "location", header: "Location", render: (item) => item.location || "Not set" },
    { key: "jobs", header: "Jobs", render: (item) => item.jobs.toLocaleString() },
    { key: "activeJobs", header: "Active", render: (item) => item.activeJobs.toLocaleString() },
    { key: "applications", header: "Applications", render: (item) => item.applications.toLocaleString() },
  ];

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            Platform Analytics
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Monitor platform health, growth, hiring activity, employer performance, jobs, applications, blogs, and category trends.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" leftIcon={<Download className="size-4" aria-hidden="true" />} disabled>
            CSV Export
          </Button>
          <Button variant="outline" leftIcon={<FileSpreadsheet className="size-4" aria-hidden="true" />} disabled>
            Excel
          </Button>
          <Button variant="outline" leftIcon={<FileText className="size-4" aria-hidden="true" />} disabled>
            PDF
          </Button>
        </div>
      </div>

      <Card contentClassName="space-y-4">
        <div className="flex flex-wrap gap-2" aria-label="Date range">
          {dateRangeOptions.map((option) => {
            const active = filters.dateRange === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilters({ dateRange: option.value })}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Input type="date" label="From" value={filters.dateFrom ?? ""} onChange={(event) => updateFilters({ dateFrom: event.target.value, dateRange: "custom" })} />
          <Input type="date" label="To" value={filters.dateTo ?? ""} onChange={(event) => updateFilters({ dateTo: event.target.value, dateRange: "custom" })} />
          <Input label="Category" value={filters.category ?? ""} onChange={(event) => updateFilters({ category: event.target.value })} placeholder="All categories" />
          <Input label="Company" value={filters.company ?? ""} onChange={(event) => updateFilters({ company: event.target.value })} placeholder="All companies" />
          <Input label="Employer" value={filters.employer ?? ""} onChange={(event) => updateFilters({ employer: event.target.value })} placeholder="All employers" />
          <Input label="Location" value={filters.location ?? ""} onChange={(event) => updateFilters({ location: event.target.value })} placeholder="All locations" />
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => router.replace(pathname, { scroll: false })} leftIcon={<X className="size-4" aria-hidden="true" />}>
            Reset Filters
          </Button>
        </div>
      </Card>

      {analyticsQuery.isError ? (
        <ErrorState
          title="Unable to load analytics"
          message="Platform analytics could not be loaded. Please check the API and try again."
          onRetry={() => analyticsQuery.refetch()}
        />
      ) : null}

      {analyticsQuery.isLoading ? (
        <div className="space-y-5">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <LoadingSkeleton key={index} variant="card" />
            ))}
          </section>
          <div className="grid gap-5 xl:grid-cols-2">
            <LoadingSkeleton variant="card" className="min-h-80" />
            <LoadingSkeleton variant="card" className="min-h-80" />
          </div>
        </div>
      ) : null}

      {data && data.kpis.length === 0 ? (
        <EmptyState
          title="No analytics available"
          description="No platform records match the selected filters yet."
        />
      ) : null}

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {data.kpis.map((metric, index) => {
              const Icon = metricIcons[metric.key];
              const trend = metric.growthPercentage > 0 ? "up" : metric.growthPercentage < 0 ? "down" : "neutral";

              return (
                <DashboardMetricCard
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  change={`${Math.abs(metric.growthPercentage)}% ${metric.comparisonLabel}`}
                  trend={trend}
                  tone={metricTone(index)}
                  icon={<Icon className="size-5" aria-hidden="true" />}
                />
              );
            })}
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <WidgetErrorBoundary context="admin-analytics-growth-chart">
              <TrendChart data={data.trends} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary context="admin-analytics-hiring-funnel">
              <HiringFunnel data={data.hiringFunnel} />
            </WidgetErrorBoundary>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <WidgetErrorBoundary context="admin-analytics-category-chart">
              <CategoryDistributionChart data={data.categoryDistribution} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary context="admin-analytics-location-chart">
              <LocationChart data={data.locationDistribution} />
            </WidgetErrorBoundary>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <DashboardSection title="Top Performing Categories" description="Categories ranked by jobs, active jobs, applications, and company reach.">
              <Table
                columns={categoryColumns}
                data={topCategories}
                getRowKey={(item) => item.category}
                emptyMessage="No category analytics match the current filters."
              />
              <AnalyticsTablePagination
                page={categoryPage}
                total={data.topCategories.length}
                onPageChange={(page) => setPage("categoryPage", page)}
              />
            </DashboardSection>

            <DashboardSection title="Top Hiring Companies" description="Companies ranked by jobs and application activity.">
              <Table
                columns={companyColumns}
                data={topCompanies}
                getRowKey={(item, index) => item.companyId ?? `${item.company}-${index}`}
                emptyMessage="No company analytics match the current filters."
              />
              <AnalyticsTablePagination
                page={companyPage}
                total={data.topCompanies.length}
                onPageChange={(page) => setPage("companyPage", page)}
              />
            </DashboardSection>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <DashboardSection title="Most Active Employers" description="Employers ranked by job and application activity.">
              <div className="space-y-3">
                {data.topEmployers.length === 0 ? (
                  <DashboardEmptyState
                    title="No employer activity yet"
                    description="Employer activity will appear after employers publish jobs."
                  />
                ) : data.topEmployers.slice(0, 6).map((employer) => (
                  <div key={employer.employerId ?? employer.employer} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">{employer.employer}</p>
                      <p className="text-sm text-muted">{employer.jobs.toLocaleString()} jobs</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{employer.applications.toLocaleString()} apps</span>
                  </div>
                ))}
              </div>
            </DashboardSection>

            <DashboardSection title="Most Applied Jobs" description="Jobs ranked by application volume.">
              <div className="space-y-3">
                {data.topJobs.length === 0 ? (
                  <DashboardEmptyState
                    title="No applied jobs yet"
                    description="Job rankings will appear after candidates submit applications."
                  />
                ) : data.topJobs.slice(0, 6).map((job) => (
                  <div key={job.jobId} className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-sm text-muted">{job.company || job.category || "Uncategorized"}</p>
                      </div>
                      <AdminStatusBadge status={job.status} />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-primary">{job.applications.toLocaleString()} applications</p>
                  </div>
                ))}
              </div>
            </DashboardSection>

            <DashboardSection title="Blog Analytics" description="Published and high-engagement editorial content.">
              <div className="space-y-3">
                {data.topBlogs.length === 0 ? (
                  <DashboardEmptyState
                    title="No blog analytics yet"
                    description="Blog analytics will appear after editorial content is published."
                  />
                ) : data.topBlogs.slice(0, 6).map((blog) => (
                  <div key={blog.blogId} className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-foreground">{blog.title}</p>
                      <AdminStatusBadge status={blog.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted">{blog.views.toLocaleString()} views</p>
                  </div>
                ))}
              </div>
            </DashboardSection>
          </div>

          <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
            Export controls are wired as extension points. CSV, Excel, and PDF exports should be enabled when backend report generation endpoints are available.
          </footer>
        </>
      ) : null}
    </main>
  );
}
