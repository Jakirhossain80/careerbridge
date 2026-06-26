"use client";

import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, ShieldAlert, TrendingUp, Users } from "lucide-react";

import Card from "@/components/ui/Card";
import type { AdminJobSeekerStats } from "@/types/admin-job-seeker.types";

type JobSeekerStatsCardsProps = {
  stats?: AdminJobSeekerStats;
  loading?: boolean;
};

type StatsItem = {
  key: keyof AdminJobSeekerStats;
  label: string;
  icon: LucideIcon;
  tone: string;
  suffix?: string;
};

const items: StatsItem[] = [
  {
    key: "totalJobSeekers",
    label: "Total Job Seekers",
    icon: Users,
    tone: "bg-blue-50 text-primary",
  },
  {
    key: "activeApplications",
    label: "Active Applications",
    icon: BriefcaseBusiness,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "averageProfileCompletion",
    label: "Average Strength",
    icon: TrendingUp,
    tone: "bg-indigo-50 text-indigo-700",
    suffix: "%",
  },
  {
    key: "blockedAccounts",
    label: "Blocked Accounts",
    icon: ShieldAlert,
    tone: "bg-red-50 text-red-700",
  },
];

export default function JobSeekerStatsCards({
  stats,
  loading = false,
}: JobSeekerStatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const value = stats?.[item.key];

        return (
          <Card key={item.key} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {loading
                    ? "..."
                    : typeof value === "number"
                      ? `${value.toLocaleString()}${item.suffix ?? ""}`
                      : "Unavailable"}
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
