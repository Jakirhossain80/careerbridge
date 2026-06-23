import { Card } from "@/components/ui";
import type { RecruitmentFunnelStage } from "@/types/analytics.types";

type RecruitmentFunnelChartProps = {
  data: RecruitmentFunnelStage[];
};

export default function RecruitmentFunnelChart({
  data,
}: RecruitmentFunnelChartProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Recruitment Funnel
          </h2>
          <p className="mt-1 text-sm text-muted">
            Candidate movement from job views to hires.
          </p>
        </div>
      }
      contentClassName="space-y-4 p-5"
    >
      {data.map((stage) => (
        <div key={stage.label}>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-foreground">{stage.label}</span>
            <span className="text-muted">
              {stage.count.toLocaleString()} ({stage.percentage}%)
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.min(Math.max(stage.percentage, 4), 100)}%` }}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
