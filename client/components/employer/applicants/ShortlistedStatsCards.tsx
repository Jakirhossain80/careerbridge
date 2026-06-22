import { BarChart3, CalendarCheck, Sparkles, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";
import type {
  EmployerApplication,
  EmployerApplicationsMeta,
} from "@/types/application.types";

type ShortlistedStatsCardsProps = {
  applications: EmployerApplication[];
  total: number;
  meta?: EmployerApplicationsMeta;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function calculateAverageExperience(applications: EmployerApplication[]) {
  const values = applications
    .map((application) => application.experienceYears)
    .filter((value): value is number => typeof value === "number");

  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function ShortlistedStatsCards({
  applications,
  total,
  meta,
}: ShortlistedStatsCardsProps) {
  const interviewsSet =
    meta?.interviewsSet ??
    applications.filter((application) => application.interviewScheduledAt).length;
  const averageExperience =
    meta?.averageExperience ?? calculateAverageExperience(applications);
  const diversityScore =
    typeof meta?.diversityScore === "number"
      ? `${Math.round(meta.diversityScore)}%`
      : "Not available";

  const stats = [
    {
      label: "Total Shortlisted",
      value: formatNumber(meta?.totalShortlisted ?? total),
      helper: "Candidates ready for next review",
      icon: UsersRound,
    },
    {
      label: "Interviews Set",
      value: formatNumber(interviewsSet),
      helper: "Scheduled from this shortlist",
      icon: CalendarCheck,
    },
    {
      label: "Average Experience",
      value: `${averageExperience.toFixed(1)} yrs`,
      helper: "Based on available profiles",
      icon: BarChart3,
    },
    {
      label: "Diversity Score",
      value: diversityScore,
      helper: "Provided by backend analytics",
      icon: Sparkles,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} contentClassName="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">{stat.helper}</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
