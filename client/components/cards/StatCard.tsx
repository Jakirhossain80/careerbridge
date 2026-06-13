import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui";

type StatCardVariant = "primary" | "success" | "warning" | "danger" | "neutral";

type StatCardTrend = {
  value: string;
  direction: "up" | "down" | "neutral";
  label?: string;
};

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: StatCardTrend;
  variant?: StatCardVariant;
  className?: string;
};

const variantClasses: Record<StatCardVariant, string> = {
  primary: "bg-blue-50 text-primary",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-slate-100 text-slate-700",
};

const trendClasses: Record<StatCardTrend["direction"], string> = {
  up: "text-emerald-700",
  down: "text-red-700",
  neutral: "text-muted",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "primary",
  className,
}: StatCardProps) {
  return (
    <Card className={className} contentClassName="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        {icon ? (
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-md",
              variantClasses[variant],
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      ) : null}

      {trend ? (
        <p
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold",
            trendClasses[trend.direction],
          )}
        >
          {trend.direction === "up" ? (
            <TrendingUp className="size-4" aria-hidden="true" />
          ) : null}
          {trend.direction === "down" ? (
            <TrendingDown className="size-4" aria-hidden="true" />
          ) : null}
          <span>{trend.value}</span>
          {trend.label ? <span className="font-medium">{trend.label}</span> : null}
        </p>
      ) : null}
    </Card>
  );
}

export type { StatCardProps, StatCardTrend, StatCardVariant };
