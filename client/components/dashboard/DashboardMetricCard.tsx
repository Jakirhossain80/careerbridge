import type { ReactNode } from "react";

import { Card } from "@/components/ui";
import type { AdminDashboardMetric } from "@/types/admin-dashboard.types";

type DashboardMetricCardProps = AdminDashboardMetric & {
  icon?: ReactNode;
};

const toneClasses: Record<
  NonNullable<AdminDashboardMetric["tone"]>,
  { icon: string; change: string }
> = {
  primary: { icon: "bg-blue-50 text-primary", change: "text-blue-700" },
  secondary: {
    icon: "bg-emerald-50 text-emerald-700",
    change: "text-emerald-700",
  },
  tertiary: {
    icon: "bg-indigo-50 text-indigo-700",
    change: "text-indigo-700",
  },
  danger: { icon: "bg-red-50 text-red-700", change: "text-red-700" },
  neutral: { icon: "bg-slate-100 text-slate-700", change: "text-slate-600" },
};

export default function DashboardMetricCard({
  label,
  value,
  change,
  trend = "neutral",
  tone = "neutral",
  icon,
}: DashboardMetricCardProps) {
  const classes = toneClasses[tone];

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change ? (
            <p className={`mt-2 text-xs font-semibold ${classes.change}`}>
              {trend === "up" ? "+" : trend === "down" ? "-" : ""}
              {change}
            </p>
          ) : null}
        </div>
        {icon ? (
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${classes.icon}`}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
