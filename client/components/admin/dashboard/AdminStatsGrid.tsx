import {
  BriefcaseBusiness,
  Building2,
  Flag,
  Users,
} from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import type { AdminDashboardMetric } from "@/types/admin-dashboard.types";

type AdminStatsGridProps = {
  metrics: AdminDashboardMetric[];
};

const metricIcons = {
  "total-users": Users,
  employers: Building2,
  "active-jobs": BriefcaseBusiness,
  "pending-reports": Flag,
};

export default function AdminStatsGrid({ metrics }: AdminStatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const { key, ...metricProps } = metric;
        const Icon = metricIcons[key as keyof typeof metricIcons];

        return (
          <DashboardMetricCard
            key={key}
            {...metricProps}
            icon={Icon ? <Icon className="size-5" aria-hidden="true" /> : undefined}
          />
        );
      })}
    </section>
  );
}
