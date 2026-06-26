import { BriefcaseBusiness, FolderTree, Star, TrendingUp } from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import type { AdminCategoryStats } from "@/types/admin-category";

type CategoryStatsCardsProps = {
  stats?: AdminCategoryStats;
  loading?: boolean;
};

export default function CategoryStatsCards({
  stats,
  loading = false,
}: CategoryStatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        key="category-total"
        label="Total Categories"
        value={loading ? "Loading" : (stats?.totalCategories ?? 0)}
        change="Global taxonomy entries"
        trend="neutral"
        tone="primary"
        icon={<FolderTree className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="category-active-jobs"
        label="Active Jobs"
        value={loading ? "Loading" : (stats?.activeJobs ?? 0)}
        change="Requires category job counts"
        trend="neutral"
        tone="secondary"
        icon={<BriefcaseBusiness className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="category-average"
        label="Average Jobs Per Category"
        value={
          loading ? "Loading" : (stats?.averageJobsPerCategory ?? 0).toFixed(1)
        }
        change="Based on available counts"
        trend="neutral"
        tone="tertiary"
        icon={<TrendingUp className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="category-top"
        label="Top Performer"
        value={loading ? "Loading" : (stats?.topPerformer ?? "Not tracked")}
        change="Highest active job count"
        trend="neutral"
        tone="neutral"
        icon={<Star className="size-5" aria-hidden="true" />}
      />
    </section>
  );
}
