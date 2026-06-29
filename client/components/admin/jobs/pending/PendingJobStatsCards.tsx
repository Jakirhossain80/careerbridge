import { CheckCircle2, Clock3, ShieldAlert, Timer } from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { StatsCardSkeleton } from "@/components/skeletons";
import type { AdminJob } from "@/types/admin-job.types";
import type { AdminMeta } from "@/types/admin.types";

type PendingJobStatsCardsProps = {
  jobs: AdminJob[];
  meta?: AdminMeta;
  loading?: boolean;
};

function isHighRisk(job: AdminJob) {
  return (
    job.riskLevel === "high" ||
    job.riskLevel === "critical" ||
    (job.riskScore ?? 0) >= 70
  );
}

function isToday(value?: string) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function PendingJobStatsCards({
  jobs,
  meta,
  loading = false,
}: PendingJobStatsCardsProps) {
  if (loading) {
    return <StatsCardSkeleton />;
  }

  const highRiskCount = jobs.filter(isHighRisk).length;
  const approvedToday = jobs.filter(
    (job) => job.approvalStatus === "approved" && isToday(job.updatedAt),
  ).length;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        key="pending-jobs-total"
        label="Total Pending"
        value={loading ? "Loading" : (meta?.total ?? jobs.length)}
        change="Awaiting moderation"
        trend="neutral"
        tone="primary"
        icon={<Clock3 className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="pending-jobs-risk"
        label="High Risk Flagged"
        value={loading ? "Loading" : highRiskCount}
        change="Current page risk signals"
        trend="neutral"
        tone={highRiskCount > 0 ? "danger" : "neutral"}
        icon={<ShieldAlert className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="pending-jobs-review-time"
        label="Average Review Time"
        value="Not tracked"
        change="Requires moderation analytics"
        trend="neutral"
        tone="neutral"
        icon={<Timer className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="pending-jobs-approved-today"
        label="Approved Today"
        value={loading ? "Loading" : approvedToday}
        change="Derived from available updates"
        trend="neutral"
        tone="secondary"
        icon={<CheckCircle2 className="size-5" aria-hidden="true" />}
      />
    </section>
  );
}
