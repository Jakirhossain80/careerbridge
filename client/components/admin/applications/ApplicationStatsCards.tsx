import { AlertTriangle, BriefcaseBusiness, CheckCircle2, Clock3 } from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { StatsCardSkeleton } from "@/components/skeletons";
import type { AdminApplicationStats } from "@/types/admin-application";

type ApplicationStatsCardsProps = {
  stats?: AdminApplicationStats;
  loading?: boolean;
};

export default function ApplicationStatsCards({
  stats,
  loading = false,
}: ApplicationStatsCardsProps) {
  if (loading) {
    return <StatsCardSkeleton />;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        key="applications-total"
        label="Total Applications"
        value={loading ? "Loading" : (stats?.totalApplications ?? 0)}
        change="System-wide submissions"
        trend="neutral"
        tone="primary"
        icon={<BriefcaseBusiness className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="applications-pending"
        label="Pending Review"
        value={loading ? "Loading" : (stats?.pendingReview ?? 0)}
        change="Awaiting recruiter action"
        trend="neutral"
        tone="tertiary"
        icon={<Clock3 className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="applications-hired"
        label="Hired This Month"
        value={loading ? "Loading" : (stats?.hiredThisMonth ?? 0)}
        change="Derived from current records"
        trend="neutral"
        tone="secondary"
        icon={<CheckCircle2 className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="applications-suspicious"
        label="Suspicious Activity"
        value={loading ? "Loading" : (stats?.suspiciousActivity ?? 0)}
        change="Flagged or blocked applications"
        trend="neutral"
        tone={(stats?.suspiciousActivity ?? 0) > 0 ? "danger" : "neutral"}
        icon={<AlertTriangle className="size-5" aria-hidden="true" />}
      />
    </section>
  );
}
