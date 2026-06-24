import Link from "next/link";
import { BarChart3, Bookmark, BriefcaseBusiness, Eye } from "lucide-react";

import { Card } from "@/components/ui";
import type { JobSeekerProfileStats } from "@/types/job-seeker-profile.types";

type ProfileStatsCardProps = {
  stats?: JobSeekerProfileStats;
};

const statItems = [
  {
    key: "appliedJobs",
    label: "Applied Jobs",
    href: "/profile/applications",
    icon: BriefcaseBusiness,
  },
  {
    key: "savedJobs",
    label: "Saved Jobs",
    href: "/profile/saved-jobs",
    icon: Bookmark,
  },
  {
    key: "interviews",
    label: "Interviews",
    href: "/job-seeker/dashboard",
    icon: BarChart3,
  },
  {
    key: "profileViews",
    label: "Profile Views",
    href: "/job-seeker/profile",
    icon: Eye,
  },
] as const;

export default function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  if (!stats) {
    return null;
  }

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Profile statistics
          </h2>
          <p className="mt-1 text-sm text-muted">
            Your job search activity at a glance.
          </p>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key] ?? 0;

          return (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-md bg-white text-primary shadow-sm">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-4 text-2xl font-bold text-foreground">{value}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
