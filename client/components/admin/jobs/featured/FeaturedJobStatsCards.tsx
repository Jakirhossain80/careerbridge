import { BadgeDollarSign, MousePointerClick, Star, TrendingUp } from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import type { AdminFeaturedJobStats } from "@/types/admin-featured-job";

type FeaturedJobStatsCardsProps = {
  stats?: AdminFeaturedJobStats;
  loading?: boolean;
};

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function FeaturedJobStatsCards({
  stats,
  loading = false,
}: FeaturedJobStatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        key="featured-active"
        label="Active Featured"
        value={loading ? "Loading" : (stats?.activeFeatured ?? 0)}
        change="Promoted listings live now"
        trend="neutral"
        tone="primary"
        icon={<Star className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="featured-impressions"
        label="Total Impressions"
        value={loading ? "Loading" : (stats?.totalImpressions ?? 0)}
        change="Requires promotion analytics"
        trend="neutral"
        tone="tertiary"
        icon={<TrendingUp className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="featured-ctr"
        label="Avg. CTR"
        value={loading ? "Loading" : `${(stats?.averageCtr ?? 0).toFixed(1)}%`}
        change="Clicks divided by impressions"
        trend="neutral"
        tone="secondary"
        icon={<MousePointerClick className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="featured-revenue"
        label="Revenue MTD"
        value={loading ? "Loading" : formatCurrency(stats?.revenueMtd)}
        change="Requires billing integration"
        trend="neutral"
        tone="neutral"
        icon={<BadgeDollarSign className="size-5" aria-hidden="true" />}
      />
    </section>
  );
}
