"use client";

import { CalendarDays, Clock } from "lucide-react";

import InterviewStatusBadge from "@/components/employer/interviews/InterviewStatusBadge";
import { Card } from "@/components/ui";
import type { JobSeekerInterview } from "@/types/interview.types";
import { interviewTypeLabels } from "@/types/interview.types";

type JobSeekerInterviewCalendarViewProps = {
  interviews: JobSeekerInterview[];
  onSelectInterview: (interview: JobSeekerInterview) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function JobSeekerInterviewCalendarView({
  interviews,
  onSelectInterview,
}: JobSeekerInterviewCalendarViewProps) {
  const grouped = interviews.reduce<Record<string, JobSeekerInterview[]>>(
    (acc, interview) => {
      acc[interview.interviewDate] = acc[interview.interviewDate] ?? [];
      acc[interview.interviewDate].push(interview);
      return acc;
    },
    {},
  );
  const dates = Object.keys(grouped).sort();

  return (
    <Card
      header={
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Calendar View
            </h2>
            <p className="mt-1 text-sm text-muted">
              Interview invitations grouped by scheduled date
            </p>
          </div>
        </div>
      }
      contentClassName="space-y-5 p-4 sm:p-5"
    >
      {dates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-muted dark:border-slate-700">
          No interviews found for the selected filters.
        </div>
      ) : (
        dates.map((date) => (
          <section key={date} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {formatDate(date)}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {grouped[date].map((interview) => (
                <button
                  key={interview._id}
                  type="button"
                  className="rounded-lg border border-slate-200 bg-background p-4 text-left transition hover:border-primary/40 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:bg-slate-800"
                  onClick={() => onSelectInterview(interview)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {interview.jobTitle}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {interview.companyName}
                      </p>
                    </div>
                    <InterviewStatusBadge status={interview.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4" aria-hidden="true" />
                      {interview.interviewTime}
                    </span>
                    <span>{interviewTypeLabels[interview.interviewType]}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))
      )}
    </Card>
  );
}
