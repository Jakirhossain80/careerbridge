"use client";

import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Building2, Flag, TimerReset } from "lucide-react";

import { StatsCardSkeleton } from "@/components/skeletons";
import Card from "@/components/ui/Card";
import type { AdminCompanyStats } from "@/types/admin-company.types";

type CompanyStatsCardsProps = {
  stats?: AdminCompanyStats;
  loading?: boolean;
};

type StatItem = {
  key: keyof AdminCompanyStats;
  label: string;
  icon: LucideIcon;
  tone: string;
};

const items: StatItem[] = [
  {
    key: "totalCompanies",
    label: "Total Companies",
    icon: Building2,
    tone: "bg-blue-50 text-primary",
  },
  {
    key: "pendingVerification",
    label: "Pending Verification",
    icon: TimerReset,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "activeJobListings",
    label: "Active Job Listings",
    icon: BriefcaseBusiness,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "flaggedProfiles",
    label: "Flagged Profiles",
    icon: Flag,
    tone: "bg-red-50 text-red-700",
  },
];

export default function CompanyStatsCards({
  stats,
  loading = false,
}: CompanyStatsCardsProps) {
  if (loading) {
    return <StatsCardSkeleton />;
  }

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
