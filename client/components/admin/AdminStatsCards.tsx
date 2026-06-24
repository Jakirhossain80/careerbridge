import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Flag,
  ShieldAlert,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import type { AdminStats } from "@/types/admin.types";

type AdminStatsCardsProps = {
  stats: AdminStats;
};

const items = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "totalEmployers", label: "Total Employers", icon: Building2 },
  { key: "totalJobs", label: "Total Jobs", icon: BriefcaseBusiness },
  { key: "pendingJobs", label: "Pending Jobs", icon: ShieldAlert },
  { key: "pendingEmployers", label: "Pending Employers", icon: Building2 },
  { key: "totalApplications", label: "Applications", icon: FileText },
  { key: "reports", label: "Reports", icon: Flag },
  { key: "blockedUsers", label: "Blocked Users", icon: ShieldAlert },
] as const;

export default function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {stats[item.key].toLocaleString()}
                </p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-md bg-blue-50 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
