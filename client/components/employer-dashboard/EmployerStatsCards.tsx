import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  UsersRound,
} from "lucide-react";

import type { EmployerStats } from "@/lib/employer-dashboard-data";

type EmployerStatsCardsProps = {
  stats: EmployerStats;
};

const statItems = [
  {
    key: "totalPostedJobs",
    label: "Total Posted Jobs",
    icon: BriefcaseBusiness,
    tone: "bg-blue-50 text-primary",
  },
  {
    key: "activeJobs",
    label: "Active Jobs",
    icon: CheckCircle2,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "expiredJobs",
    label: "Expired Jobs",
    icon: Clock3,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "totalApplicants",
    label: "Total Applicants",
    icon: UsersRound,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    icon: FileText,
    tone: "bg-sky-50 text-sky-700",
  },
] as const;

export default function EmployerStatsCards({ stats }: EmployerStatsCardsProps) {
  return (
    <section aria-labelledby="employer-stats-heading">
      <h2 id="employer-stats-heading" className="sr-only">
        Hiring statistics
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statItems.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key].toLocaleString();

          return (
            <article
              key={item.key}
              className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                    {value}
                  </p>
                </div>
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${item.tone}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
