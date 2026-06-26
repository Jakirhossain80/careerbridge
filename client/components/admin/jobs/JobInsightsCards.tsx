import { AlertTriangle, BriefcaseBusiness, TrendingUp } from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import type { AdminJob } from "@/types/admin-job.types";
import type { AdminMeta } from "@/types/admin.types";

type JobInsightsCardsProps = {
  jobs: AdminJob[];
  meta?: AdminMeta;
  loading?: boolean;
};

function getApplicationCount(job: AdminJob) {
  return job.applicationCount ?? job.applicationsCount ?? 0;
}

export default function JobInsightsCards({
  jobs,
  meta,
  loading = false,
}: JobInsightsCardsProps) {
  const pendingReview = jobs.filter(
    (job) => job.approvalStatus === "pending_review" || job.status === "pending",
  ).length;
  const activeJobs = jobs.filter(
    (job) => job.status === "active" || job.status === "published",
  ).length;
  const totalApplications = jobs.reduce(
    (total, job) => total + getApplicationCount(job),
    0,
  );

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <DashboardMetricCard
        key="admin-jobs-total"
        label="Platform Growth Insights"
        value={loading ? "Loading" : (meta?.total ?? jobs.length)}
        change="Total jobs matching current view"
        trend="neutral"
        tone="primary"
        icon={<TrendingUp className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="admin-jobs-active"
        label="Active Listings"
        value={loading ? "Loading" : activeJobs}
        change="Current page active postings"
        trend="neutral"
        tone="secondary"
        icon={<BriefcaseBusiness className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="admin-jobs-moderation"
        label="Safety / Moderation Insight"
        value={loading ? "Loading" : pendingReview}
        change={`${totalApplications.toLocaleString()} applications on current page`}
        trend="neutral"
        tone={pendingReview > 0 ? "danger" : "neutral"}
        icon={<AlertTriangle className="size-5" aria-hidden="true" />}
      />
    </section>
  );
}
