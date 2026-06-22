import { CalendarDays, Clock3, Video } from "lucide-react";

import type { UpcomingInterview } from "@/lib/employer-dashboard-data";

type UpcomingInterviewsProps = {
  interviews: UpcomingInterview[];
};

export default function UpcomingInterviews({
  interviews,
}: UpcomingInterviewsProps) {
  return (
    <section
      aria-labelledby="upcoming-interviews-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <h2
        id="upcoming-interviews-heading"
        className="text-lg font-semibold text-foreground"
      >
        Upcoming Interviews
      </h2>
      <p className="mt-1 text-sm text-muted">Scheduled candidate conversations.</p>

      <div className="mt-5 space-y-4">
        {interviews.map((interview) => (
          <article
            key={interview.id}
            className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Video className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {interview.candidateName}
                </h3>
                <p className="mt-1 text-sm text-muted">{interview.role}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden="true" />
                <dt className="sr-only">Date</dt>
                <dd>{interview.date}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="size-4" aria-hidden="true" />
                <dt className="sr-only">Time and mode</dt>
                <dd>
                  {interview.time} · {interview.mode}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
