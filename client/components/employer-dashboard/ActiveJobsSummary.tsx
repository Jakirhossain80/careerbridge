import { ArrowUpRight, MapPin } from "lucide-react";

import type { ActiveJob } from "@/lib/employer-dashboard-data";

type ActiveJobsSummaryProps = {
  jobs: ActiveJob[];
};

export default function ActiveJobsSummary({ jobs }: ActiveJobsSummaryProps) {
  return (
    <section
      aria-labelledby="active-jobs-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="active-jobs-heading"
            className="text-lg font-semibold text-foreground"
          >
            Active Jobs
          </h2>
          <p className="mt-1 text-sm text-muted">Open roles receiving applicants.</p>
        </div>
        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
          {jobs.length}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {job.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {job.location} · {job.type}
                </p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                {job.applicants} applicants
              </span>
              <span className="text-muted">{job.postedAt}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
