import { CheckCircle2, Circle, Clock } from "lucide-react";

import { Card } from "@/components/ui";
import type { InterviewDetails, InterviewStatus } from "@/types/interview.types";

type HiringPipelineCardProps = {
  interview: InterviewDetails;
};

const pipelineSteps = [
  { key: "applied", label: "Applied" },
  { key: "review", label: "Application Review" },
  { key: "interview", label: "Interview" },
  { key: "feedback", label: "Feedback" },
  { key: "decision", label: "Decision" },
] as const;

function getActiveIndex(status: InterviewStatus) {
  if (status === "completed") {
    return 3;
  }

  if (status === "cancelled" || status === "no_show") {
    return 2;
  }

  return 2;
}

export default function HiringPipelineCard({ interview }: HiringPipelineCardProps) {
  const activeIndex = getActiveIndex(interview.status);

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-bold text-foreground">Hiring Pipeline</h2>
          <p className="mt-1 text-sm text-muted">
            Current application and interview progression.
          </p>
        </div>
      }
      contentClassName="space-y-6 p-5"
    >
      <section className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-foreground">Job Information</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Job Title
            </dt>
            <dd className="mt-1 font-medium text-foreground">{interview.jobTitle}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Department
            </dt>
            <dd className="mt-1 text-foreground">
              {interview.department ?? "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Employment Type
            </dt>
            <dd className="mt-1 text-foreground">
              {interview.employmentType ?? "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Job Location
            </dt>
            <dd className="mt-1 text-foreground">
              {interview.jobLocation ?? "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Hiring Manager
            </dt>
            <dd className="mt-1 text-foreground">
              {interview.hiringManager ?? "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Application Status
            </dt>
            <dd className="mt-1 text-foreground">
              {interview.applicationStatus ?? "Interview"}
            </dd>
          </div>
        </dl>
      </section>

      <ol className="space-y-4">
        {pipelineSteps.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          const Icon = isComplete ? CheckCircle2 : isActive ? Clock : Circle;

          return (
            <li key={step.key} className="flex gap-3">
              <span
                className={
                  isComplete || isActive
                    ? "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    : "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800"
                }
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="mt-1 text-xs text-muted">
                  {isComplete
                    ? "Completed"
                    : isActive
                      ? "Current stage"
                      : "Pending"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
