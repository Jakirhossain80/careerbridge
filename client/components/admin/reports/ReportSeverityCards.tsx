import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

import Card from "@/components/ui/Card";
import type { AdminReportAnalytics } from "@/types/admin-report";

type ReportSeverityCardsProps = {
  analytics?: AdminReportAnalytics;
  loading?: boolean;
};

const items = [
  {
    key: "critical",
    label: "Critical Severity",
    description: "Immediate intervention recommended",
    icon: ShieldAlert,
    tone: "bg-red-50 text-red-700",
  },
  {
    key: "high",
    label: "High Priority",
    description: "Requires moderator review soon",
    icon: AlertTriangle,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "low",
    label: "Low Priority",
    description: "Low-risk reports in queue",
    icon: ShieldCheck,
    tone: "bg-emerald-50 text-emerald-700",
  },
] as const;

export default function ReportSeverityCards({
  analytics,
  loading = false,
}: ReportSeverityCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        const value = analytics?.severityCounts?.[item.key] ?? 0;

        return (
          <Card key={item.key} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {loading ? "..." : value.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
