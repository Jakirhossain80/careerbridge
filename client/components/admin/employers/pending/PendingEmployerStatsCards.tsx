"use client";

import { BadgePercent, CheckCircle2, Clock3, TimerReset } from "lucide-react";

import { StatsCardSkeleton } from "@/components/skeletons";
import Card from "@/components/ui/Card";
import type { PendingEmployerStats } from "@/types/admin-employer-verification";

type PendingEmployerStatsCardsProps = {
  stats?: PendingEmployerStats;
  loading?: boolean;
};

type StatConfig = {
  key: keyof PendingEmployerStats;
  label: string;
  icon: typeof TimerReset;
  tone: string;
  formatter?: (value: number) => string;
};

const statsConfig: StatConfig[] = [
  {
    key: "awaitingReview",
    label: "Awaiting Review",
    icon: TimerReset,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "averageWaitTimeHours",
    label: "Average Wait Time",
    icon: Clock3,
    tone: "bg-blue-50 text-primary",
    formatter: (value: number) => `${value.toLocaleString()}h`,
  },
  {
    key: "approvedThisMonth",
    label: "Approved MTD",
    icon: CheckCircle2,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "rejectionRate",
    label: "Rejection Rate",
    icon: BadgePercent,
    tone: "bg-red-50 text-red-700",
    formatter: (value: number) => `${value.toLocaleString()}%`,
  },
];

export default function PendingEmployerStatsCards({
  stats,
  loading = false,
}: PendingEmployerStatsCardsProps) {
  if (loading) {
    return <StatsCardSkeleton />;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        const value = stats?.[item.key];
        const formatted =
          typeof value === "number"
            ? item.formatter?.(value) ?? value.toLocaleString()
            : "Unavailable";

        return (
          <Card key={item.key} className="p-5" contentClassName="p-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {loading ? "..." : formatted}
                </p>
              </div>
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-md ${item.tone}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
