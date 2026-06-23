import Link from "next/link";
import { CalendarClock, ExternalLink, MapPin, Phone, Video } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { Interview } from "@/types/interview.types";
import { interviewTypeLabels } from "@/types/interview.types";
import InterviewStatusBadge from "./InterviewStatusBadge";

type UpcomingInterviewCardProps = {
  interview?: Interview;
  onSchedule: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function TypeIcon({ type }: { type: Interview["interviewType"] }) {
  if (type === "phone") {
    return <Phone className="size-3.5" aria-hidden="true" />;
  }

  if (type === "on_site") {
    return <MapPin className="size-3.5" aria-hidden="true" />;
  }

  return <Video className="size-3.5" aria-hidden="true" />;
}

export default function UpcomingInterviewCard({
  interview,
  onSchedule,
}: UpcomingInterviewCardProps) {
  return (
    <Card className="shadow-sm" contentClassName="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Upcoming Today
          </p>
          <h2 className="mt-2 text-xl font-bold text-foreground">
            {interview?.candidateName ?? "No interview today"}
          </h2>
        </div>
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarClock className="size-5" aria-hidden="true" />
        </span>
      </div>

      {interview ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {interview.jobTitle}
            </p>
            <p className="mt-1 text-sm text-muted">
              {formatDate(interview.interviewDate)} at {interview.interviewTime}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <InterviewStatusBadge status={interview.status} />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-background px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <TypeIcon type={interview.interviewType} />
              {interviewTypeLabels[interview.interviewType]}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={onSchedule}>
              Schedule New
            </Button>
            <Link
              href={`/employer/applicants/${interview.applicationId}`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
            >
              Applicant
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm leading-6 text-muted">
            Schedule interviews with shortlisted applicants and track them here.
          </p>
          <Button type="button" className="mt-4" onClick={onSchedule}>
            Schedule New Interview
          </Button>
        </div>
      )}
    </Card>
  );
}
