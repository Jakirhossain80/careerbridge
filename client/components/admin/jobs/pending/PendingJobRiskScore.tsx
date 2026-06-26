import type { AdminJob } from "@/types/admin-job.types";

type PendingJobRiskScoreProps = {
  riskScore?: AdminJob["riskScore"];
  riskLevel?: AdminJob["riskLevel"];
};

const riskStyles: Record<
  NonNullable<AdminJob["riskLevel"]>,
  { label: string; bar: string; text: string; bg: string }
> = {
  safe: {
    label: "Safe",
    bar: "bg-emerald-500",
    text: "text-emerald-800",
    bg: "bg-emerald-50",
  },
  low: {
    label: "Low",
    bar: "bg-lime-500",
    text: "text-lime-800",
    bg: "bg-lime-50",
  },
  medium: {
    label: "Medium",
    bar: "bg-amber-500",
    text: "text-amber-800",
    bg: "bg-amber-50",
  },
  high: {
    label: "High",
    bar: "bg-orange-500",
    text: "text-orange-800",
    bg: "bg-orange-50",
  },
  critical: {
    label: "Critical",
    bar: "bg-red-600",
    text: "text-red-800",
    bg: "bg-red-50",
  },
};

function inferRiskLevel(score?: number): NonNullable<AdminJob["riskLevel"]> {
  if (score === undefined) return "safe";
  if (score >= 90) return "critical";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  if (score > 0) return "low";
  return "safe";
}

export default function PendingJobRiskScore({
  riskScore,
  riskLevel,
}: PendingJobRiskScoreProps) {
  if (riskScore === undefined && !riskLevel) {
    return (
      <div className="min-w-36">
        <p className="text-sm font-medium text-slate-500">Not scored</p>
        <div className="mt-2 h-2 rounded-full bg-slate-100" />
      </div>
    );
  }

  const normalizedScore = Math.max(0, Math.min(100, riskScore ?? 0));
  const resolvedLevel = riskLevel ?? inferRiskLevel(riskScore);
  const styles = riskStyles[resolvedLevel];

  return (
    <div className="min-w-40">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${styles.bg} ${styles.text}`}>
          {styles.label}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {normalizedScore}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
}
