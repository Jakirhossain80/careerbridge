"use client";

import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Building2, ShieldCheck, TimerReset } from "lucide-react";

import Card from "@/components/ui/Card";
import type { AdminEmployerStats } from "@/types/admin-employer.types";

type EmployerStatsCardsProps = {
  stats?: AdminEmployerStats;
  loading?: boolean;
};

type StatItem = {
  key: keyof AdminEmployerStats;
  label: string;
  icon: LucideIcon;
  tone: string;
};

const items: StatItem[] = [
  {
    key: "totalEmployers",
    label: "Total Employers",
    icon: Building2,
    tone: "bg-blue-50 text-primary",
  },
  {
    key: "verifiedAccounts",
    label: "Verified Accounts",
    icon: ShieldCheck,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "pendingReview",
    label: "Pending Review",
    icon: TimerReset,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "totalActiveJobs",
    label: "Total Active Jobs",
    icon: BriefcaseBusiness,
    tone: "bg-indigo-50 text-indigo-700",
  },
];

export default function EmployerStatsCards({
  stats,
  loading = false,
}: EmployerStatsCardsProps) {
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
                      ? value.toLocaleString()
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
