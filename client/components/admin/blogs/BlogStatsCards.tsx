import { CalendarClock, Eye, FileText, Send } from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import type { AdminBlogStats } from "@/types/admin-blog";

type BlogStatsCardsProps = {
  stats?: AdminBlogStats;
  loading?: boolean;
};

export default function BlogStatsCards({ stats, loading = false }: BlogStatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        key="blogs-total"
        label="Total Articles"
        value={loading ? "Loading" : (stats?.totalArticles ?? 0)}
        change="Editorial library"
        trend="neutral"
        tone="primary"
        icon={<FileText className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="blogs-published"
        label="Published"
        value={loading ? "Loading" : (stats?.published ?? 0)}
        change="Live articles"
        trend="neutral"
        tone="secondary"
        icon={<Send className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="blogs-scheduled"
        label="Scheduled"
        value={loading ? "Loading" : (stats?.scheduled ?? 0)}
        change="Prepared for release"
        trend="neutral"
        tone="tertiary"
        icon={<CalendarClock className="size-5" aria-hidden="true" />}
      />
      <DashboardMetricCard
        key="blogs-views"
        label="Monthly Views"
        value={loading ? "Loading" : (stats?.monthlyViews ?? 0)}
        change="Requires view analytics"
        trend="neutral"
        tone="neutral"
        icon={<Eye className="size-5" aria-hidden="true" />}
      />
    </section>
  );
}
