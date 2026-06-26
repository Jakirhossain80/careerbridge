import {
  BriefcaseBusiness,
  CalendarCheck,
  Eye,
  FileCheck2,
  Heart,
  Percent,
} from "lucide-react";

import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import type { AdminUser } from "@/types/admin-user.types";

type UserStatsGridProps = {
  stats?: AdminUser["stats"];
};

const metrics = [
  {
    key: "appliedJobsCount",
    label: "Applied Jobs",
    icon: FileCheck2,
    tone: "primary" as const,
  },
  {
    key: "postedJobsCount",
    label: "Posted Jobs",
    icon: BriefcaseBusiness,
    tone: "secondary" as const,
  },
  {
    key: "savedJobsCount",
    label: "Saved Jobs",
    icon: Heart,
    tone: "tertiary" as const,
  },
  {
    key: "interviewCount",
    label: "Interviews",
    icon: CalendarCheck,
    tone: "neutral" as const,
  },
  {
    key: "profileCompletionPercentage",
    label: "Profile Completion",
    icon: Percent,
    tone: "secondary" as const,
    suffix: "%",
  },
  {
    key: "profileViews",
    label: "Profile Views",
    icon: Eye,
    tone: "primary" as const,
  },
] satisfies Array<{
  key: keyof NonNullable<AdminUser["stats"]>;
  label: string;
  icon: typeof FileCheck2;
  tone: "primary" | "secondary" | "tertiary" | "neutral";
  suffix?: string;
}>;

export default function UserStatsGrid({ stats }: UserStatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const value = stats?.[metric.key];

        return (
          <DashboardMetricCard
            key={metric.key}
            label={metric.label}
            value={value === undefined ? "Not available" : `${value}${metric.suffix ?? ""}`}
            tone={metric.tone}
            icon={<Icon className="size-5" aria-hidden="true" />}
          />
        );
      })}
    </section>
  );
}
