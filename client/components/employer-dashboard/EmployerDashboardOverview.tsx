import Link from "next/link";
import { CalendarPlus, ChevronRight, PlusCircle } from "lucide-react";

import ActiveJobsSummary from "@/components/employer-dashboard/ActiveJobsSummary";
import EmployerPerformanceSummary from "@/components/employer-dashboard/EmployerPerformanceSummary";
import EmployerStatsCards from "@/components/employer-dashboard/EmployerStatsCards";
import RecentApplicationsTable from "@/components/employer-dashboard/RecentApplicationsTable";
import UpcomingInterviews from "@/components/employer-dashboard/UpcomingInterviews";
import { Button } from "@/components/ui";
import type { EmployerDashboardData } from "@/lib/employer-dashboard-data";

type EmployerDashboardOverviewProps = {
  data: EmployerDashboardData;
};

export default function EmployerDashboardOverview({
  data,
}: EmployerDashboardOverviewProps) {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="transition hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              Dashboard
            </li>
          </ol>
        </nav>

        <header className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">
              {data.employerProfile.companyName}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Employer Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Track hiring performance, review new applicants, and manage active
              roles from one workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              leftIcon={<CalendarPlus className="size-4" aria-hidden="true" />}
            >
              Schedule Interview
            </Button>
            <Button
              className="w-full sm:w-auto"
              leftIcon={<PlusCircle className="size-4" aria-hidden="true" />}
            >
              Post a Job
            </Button>
          </div>
        </header>

        <EmployerStatsCards stats={data.stats} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <EmployerPerformanceSummary data={data.performanceData} />
            <RecentApplicationsTable applications={data.recentApplications} />
          </div>

          <aside className="flex flex-col gap-6" aria-label="Dashboard summaries">
            <ActiveJobsSummary jobs={data.activeJobs} />
            <UpcomingInterviews interviews={data.upcomingInterviews} />
          </aside>
        </div>
      </div>
    </main>
  );
}
