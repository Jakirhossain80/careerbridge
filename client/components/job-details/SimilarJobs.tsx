import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Card } from "@/components/ui";
import type { SimilarJob } from "@/lib/job-details-data";

type SimilarJobsProps = {
  jobs: SimilarJob[];
};

export default function SimilarJobs({ jobs }: SimilarJobsProps) {
  return (
    <section aria-labelledby="similar-jobs-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="similar-jobs-heading"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Similar jobs
        </h2>
        <Link
          href="/jobs"
          className="text-sm font-semibold text-primary transition hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} contentClassName="p-5">
            <article className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold tracking-tight text-foreground">
                  <Link
                    href={job.href}
                    className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {job.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm font-medium text-muted">
                  {job.company}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                    {job.location}
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    {job.salary}
                  </span>
                </div>
              </div>

              <Link
                href={job.href}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                View job
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          </Card>
        ))}
      </div>
    </section>
  );
}
