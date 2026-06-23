import { Badge } from "@/components/ui";
import type { InterviewStatus } from "@/types/interview.types";
import { interviewStatusLabels } from "@/types/interview.types";

type InterviewStatusBadgeProps = {
  status: InterviewStatus;
};

const statusClasses: Record<InterviewStatus, string> = {
  scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-slate-200 bg-slate-100 text-slate-700",
  rescheduled: "border-amber-200 bg-amber-50 text-amber-800",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  no_show: "border-orange-200 bg-orange-50 text-orange-800",
};

export default function InterviewStatusBadge({
  status,
}: InterviewStatusBadgeProps) {
  return (
    <Badge className={statusClasses[status]}>
      {interviewStatusLabels[status]}
    </Badge>
  );
}
