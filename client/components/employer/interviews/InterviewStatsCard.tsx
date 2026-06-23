import { BarChart3, CalendarCheck, CheckCircle2, XCircle } from "lucide-react";

import { Card } from "@/components/ui";
import type { EmployerInterviewsMeta } from "@/types/interview.types";

type InterviewStatsCardProps = {
  meta?: EmployerInterviewsMeta;
};

export default function InterviewStatsCard({ meta }: InterviewStatsCardProps) {
  const stats = [
    {
      label: "This month",
      value: meta?.totalThisMonth ?? 0,
      icon: BarChart3,
    },
    {
      label: "Today",
      value: meta?.upcomingToday ?? 0,
      icon: CalendarCheck,
    },
    {
      label: "Completed",
      value: meta?.completedThisMonth ?? 0,
      icon: CheckCircle2,
    },
    {
      label: "Cancelled",
      value: meta?.cancelledThisMonth ?? 0,
      icon: XCircle,
    },
  ];

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Monthly Stats
          </h2>
          <p className="mt-1 text-sm text-muted">Interview activity summary</p>
        </div>
      }
      contentClassName="grid grid-cols-2 gap-3 p-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
          >
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase text-muted">
              {stat.label}
            </p>
          </div>
        );
      })}
    </Card>
  );
}
