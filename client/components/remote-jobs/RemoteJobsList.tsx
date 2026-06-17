import Link from "next/link";
import {
  ArrowUpDown,
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  Globe2,
  MapPin,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";
import {
  remoteJobs,
  remoteSortOptions,
  type RemoteJob,
} from "@/lib/remote-jobs-data";

type RemoteJobsListProps = {
  jobs?: RemoteJob[];
};

function RemoteJobCard({ job }: { job: RemoteJob }) {
  return (
    <Card
      className="transition hover:border-primary/40 hover:shadow-md"
      contentClassName="p-5"
    >
      <article>
        <div className="flex items-start gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-md ring-1 ${job.companyTone}`}
            aria-hidden="true"
          >
            <span className="text-sm font-bold">{job.companyInitials}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {job.featured ? <Badge variant="primary">Featured</Badge> : null}
                  <Badge variant="success">{job.remoteType}</Badge>
                  {job.asyncFirst ? (
                    <Badge variant="neutral">Async first</Badge>
                  ) : null}
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
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
              </div>

              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-muted transition hover:bg-slate-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:hover:bg-slate-800"
                aria-label={`Save ${job.title}`}
              >
                <Bookmark className="size-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {job.description}
            </p>

            <dl className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <div className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Location restriction</dt>
                <dd>{job.locationRestriction}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <Globe2 className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Timezone</dt>
                <dd>{job.timezone}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <BriefcaseBusiness
                  className="size-4 text-slate-400"
                  aria-hidden="true"
                />
                <dt className="sr-only">Job type</dt>
                <dd>
                  {job.jobType} - {job.experienceLevel}
                </dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Posted</dt>
                <dd>{job.postedAt}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {job.salary}
                </p>
                <p className="mt-1 text-xs text-muted">{job.category}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Card>
  );
}

export default function RemoteJobsList({
  jobs: jobResults = remoteJobs,
}: RemoteJobsListProps) {
  return (
    <section aria-labelledby="remote-results-heading">
      <div className="mb-5 flex flex-col gap-4 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="remote-results-heading"
            className="text-sm font-semibold text-foreground"
          >
            Featured remote jobs
          </h2>
          <p className="mt-1 text-sm text-muted">
            Showing {jobResults.length} remote roles matched from 6,200+ active
            openings
          </p>
        </div>

        <label className="relative block">
          <span className="sr-only">Sort remote jobs</span>
          <ArrowUpDown
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <select
            name="sort"
            defaultValue="Most relevant"
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:w-52"
          >
            {remoteSortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5">
        {jobResults.map((job) => (
          <RemoteJobCard key={job.id} job={job} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          Load more jobs
        </button>
      </div>
    </section>
  );
}
