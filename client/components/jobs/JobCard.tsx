import Link from "next/link";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  DollarSign,
  MapPin,
  UsersRound,
} from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { Job } from "@/lib/jobs-data";

type JobCardProps = {
  job: Job;
  view?: "grid" | "list";
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function JobCard({ job, view = "grid" }: JobCardProps) {
  return (
    <Card
      className={cn(
        "h-full transition hover:border-primary/40 hover:shadow-md",
        job.featured && "border-primary/40 shadow-blue-900/10",
      )}
      contentClassName="p-5"
    >
      <article
        className={cn(
          "flex h-full flex-col",
          view === "list" && "sm:flex-row sm:gap-5",
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-md ring-1",
              job.companyTone,
            )}
            aria-hidden="true"
          >
            <span className="text-sm font-bold">{job.companyInitials}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              {job.featured ? <Badge variant="primary">Featured</Badge> : null}
              {job.urgent ? <Badge variant="warning">Urgent</Badge> : null}
              <Badge variant="neutral">{job.category}</Badge>
            </div>

            <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
              <Link
                href={job.href}
                className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {job.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm font-medium text-muted">{job.company}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-sm leading-6 text-muted">{job.description}</p>

          <dl className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <div className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">Location</dt>
              <dd>{job.location}</dd>
            </div>
            <div className="inline-flex items-center gap-2">
              <BriefcaseBusiness
                className="size-4 text-slate-400"
                aria-hidden="true"
              />
              <dt className="sr-only">Job type</dt>
              <dd>
                {job.jobType} - {job.workMode}
              </dd>
            </div>
            <div className="inline-flex items-center gap-2">
              <DollarSign className="size-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">Salary</dt>
              <dd className="font-semibold text-emerald-700 dark:text-emerald-300">
                {job.salary}
              </dd>
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">Posted</dt>
              <dd>{job.postedAt}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="neutral">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <UsersRound className="size-4" aria-hidden="true" />
              {job.applicants} applicants
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="size-9 p-0"
                aria-label={`Save ${job.title}`}
              >
                <Bookmark className="size-4" aria-hidden="true" />
              </Button>
              <Link
                href={job.href}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                View job
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Card>
  );
}
