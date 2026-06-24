import { CheckCircle2, FileCheck2, Gauge } from "lucide-react";

import { Card } from "@/components/ui";
import DashboardMetricCard from "@/components/job-seeker/dashboard/DashboardMetricCard";
import type { ResumeManagerData } from "@/types/resume.types";

type ResumePerformanceCardProps = {
  data?: ResumeManagerData;
};

function formatDate(value?: string) {
  if (!value) {
    return "No update yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function ResumePerformanceCard({ data }: ResumePerformanceCardProps) {
  const score = data?.performance?.score ?? 0;

  return (
    <div className="space-y-4">
      <DashboardMetricCard
        label="Resume score"
        value={score ? `${score}%` : "Missing"}
        helperText={data?.performance?.label ?? "Upload a resume to start tracking."}
        tone={score >= 80 ? "secondary" : score > 0 ? "tertiary" : "neutral"}
        icon="active"
      />

      <Card
        header={
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Resume performance
            </h2>
            <p className="mt-1 text-sm text-muted">
              Prepared for application and profile integration.
            </p>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Gauge className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-700">
                {data?.performance?.summary ??
                  "Upload a resume to see readiness insights."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                {data?.resumeCompletionStatus ?? "Resume missing"}
              </div>
              <p className="mt-1 text-xs text-muted">Completion status</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileCheck2 className="size-4 text-primary" aria-hidden="true" />
                {formatDate(data?.lastResumeUpdate)}
              </div>
              <p className="mt-1 text-xs text-muted">Last resume update</p>
            </div>
          </div>

          {typeof data?.profileCompletion === "number" ? (
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Profile completion</span>
                <span className="font-semibold text-primary">
                  {data.profileCompletion}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.min(data.profileCompletion, 100)}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
