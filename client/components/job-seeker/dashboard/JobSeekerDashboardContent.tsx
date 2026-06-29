"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { StatsCardSkeleton } from "@/components/skeletons";
import { Button, LoadingSkeleton } from "@/components/ui";
import DashboardMetricCard from "@/components/job-seeker/dashboard/DashboardMetricCard";
import JobSeekerNotificationsCard from "@/components/job-seeker/dashboard/JobSeekerNotificationsCard";
import ProfileStrengthCard from "@/components/job-seeker/dashboard/ProfileStrengthCard";
import QuickActionsGrid from "@/components/job-seeker/dashboard/QuickActionsGrid";
import RecentApplicationsTable from "@/components/job-seeker/dashboard/RecentApplicationsTable";
import RecommendedJobsCard from "@/components/job-seeker/dashboard/RecommendedJobsCard";
import UpcomingInterviewsCard from "@/components/job-seeker/dashboard/UpcomingInterviewsCard";
import { getJobSeekerDashboard } from "@/services/job-seeker-dashboard.service";
import type { JobSeekerDashboardMetric } from "@/types/job-seeker-dashboard.types";

export const jobSeekerDashboardQueryKeys = {
  dashboard: ["job-seeker-dashboard"] as const,
  profile: ["job-seeker-profile"] as const,
  appliedJobs: (limit = 5) => ["applied-jobs", { limit }] as const,
  savedJobs: ["saved-jobs"] as const,
  interviews: ["job-seeker-interviews"] as const,
  recommendedJobs: ["recommended-jobs"] as const,
  notifications: ["job-seeker-notifications"] as const,
};

function DashboardLoadingState() {
  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <LoadingSkeleton variant="card" rows={1} />
        <StatsCardSkeleton count={6} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" />
        <LoadingSkeleton variant="table" rows={4} columns={4} />
      </div>
    </main>
  );
}

export default function JobSeekerDashboardContent() {
  const dashboardQuery = useQuery({
    queryKey: jobSeekerDashboardQueryKeys.dashboard,
    queryFn: getJobSeekerDashboard,
  });

  const metrics = useMemo<JobSeekerDashboardMetric[]>(() => {
    if (!dashboardQuery.data) {
      return [];
    }

    return [
      {
        label: "Total Applied",
        value: dashboardQuery.data.metrics.totalApplied,
        tone: "primary",
        icon: "applied",
      },
      {
        label: "Active Applications",
        value: dashboardQuery.data.metrics.activeApplications,
        tone: "secondary",
        icon: "active",
      },
      {
        label: "Saved Jobs",
        value: dashboardQuery.data.metrics.savedJobs,
        tone: "tertiary",
        icon: "saved",
      },
      {
        label: "Interviews",
        value: dashboardQuery.data.metrics.interviews,
        tone: "primary",
        icon: "interviews",
      },
      {
        label: "Job Alerts",
        value: dashboardQuery.data.metrics.jobAlerts,
        tone: "neutral",
        icon: "alerts",
      },
      {
        label: "Recommended",
        value: dashboardQuery.data.metrics.recommendedJobs,
        tone: "secondary",
        icon: "recommended",
      },
    ];
  }, [dashboardQuery.data]);

  if (dashboardQuery.isLoading) {
    return <DashboardLoadingState />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-base font-semibold text-red-900">
            Unable to load dashboard data. Please try again.
          </h2>
          <Button className="mt-4" onClick={() => void dashboardQuery.refetch()}>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  const data = dashboardQuery.data;

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Your job search dashboard
          </h1>
          <p className="max-w-3xl text-sm text-muted">
            Track profile strength, applications, saved jobs, interviews, and
            recommendations from one workspace.
          </p>
        </section>

        <ProfileStrengthCard profile={data.profile} />

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
          aria-label="Dashboard metrics"
        >
          {metrics.map((metric) => (
            <DashboardMetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              tone={metric.tone}
              icon={metric.icon}
            />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <RecentApplicationsTable applications={data.recentApplications} />
          <UpcomingInterviewsCard interviews={data.upcomingInterviews} />
        </section>

        <RecommendedJobsCard jobs={data.recommendedJobs} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <JobSeekerNotificationsCard notifications={data.notifications ?? []} />
          <QuickActionsGrid />
        </section>
      </div>
    </main>
  );
}
