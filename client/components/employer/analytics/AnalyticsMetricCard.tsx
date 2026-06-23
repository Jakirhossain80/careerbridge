import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui";
import type { AnalyticsMetric } from "@/types/analytics.types";

type AnalyticsMetricCardProps = {
  metric: AnalyticsMetric;
};

const trendStyles = {
  up: "bg-emerald-50 text-emerald-700",
  down: "bg-red-50 text-red-700",
  neutral: "bg-slate-100 text-slate-600",
};

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight,
};

export default function AnalyticsMetricCard({
  metric,
}: AnalyticsMetricCardProps) {
  const trend = metric.trend ?? "neutral";
  const Icon = trendIcons[trend];

  return (
    <Card contentClassName="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{metric.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            {metric.value}
          </p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${trendStyles[trend]}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>

      {metric.change ? (
        <p className="mt-4 text-sm font-medium text-muted">{metric.change}</p>
      ) : null}
    </Card>
  );
}
