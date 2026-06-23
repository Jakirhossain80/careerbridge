import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui";
import type { DashboardMetricTone } from "@/types/job-seeker-dashboard.types";

const toneClasses: Record<DashboardMetricTone, string> = {
  primary: "bg-blue-50 text-primary",
  secondary: "bg-emerald-50 text-emerald-700",
  tertiary: "bg-amber-50 text-amber-700",
  neutral: "bg-slate-100 text-slate-700",
};

const iconMap: Record<string, LucideIcon> = {
  applied: FileText,
  active: BriefcaseBusiness,
  saved: Bookmark,
  interviews: CalendarDays,
  alerts: Bell,
  recommended: BriefcaseBusiness,
};

type DashboardMetricCardProps = {
  label: string;
  value: number | string;
  helperText?: string;
  tone?: DashboardMetricTone;
  icon?: string;
};

export default function DashboardMetricCard({
  label,
  value,
  helperText,
  tone = "neutral",
  icon = "active",
}: DashboardMetricCardProps) {
  const Icon = iconMap[icon] ?? BriefcaseBusiness;

  return (
    <Card contentClassName="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {helperText ? (
            <p className="mt-1 text-xs text-muted">{helperText}</p>
          ) : null}
        </div>
        <div className={`rounded-md p-2 ${toneClasses[tone]}`}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

export type { DashboardMetricCardProps };
