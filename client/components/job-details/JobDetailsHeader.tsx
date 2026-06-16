import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { buildJobMeta, type JobDetails } from "@/lib/job-details-data";

type JobDetailsHeaderProps = {
  job: JobDetails;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  const meta = buildJobMeta(job);

  return (
    <header className="bg-background px-6 pb-8 pt-6">
      <div className="mx-auto w-full max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="transition hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li>
              <Link href="/jobs" className="transition hover:text-primary">
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li className="font-medium text-foreground" aria-current="page">
              {job.title}
            </li>
          </ol>
        </nav>

        <Card className="border-primary/10 shadow-md shadow-blue-900/5" contentClassName="p-6 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div
                className={cn(
                  "flex size-16 shrink-0 items-center justify-center rounded-lg ring-1 sm:size-20",
                  job.companyTone,
                )}
                aria-hidden="true"
              >
                <span className="text-lg font-bold sm:text-xl">
                  {job.companyInitials}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">
                  {job.company}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {job.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                  {job.companyTagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.statusBadges.map((badge) => (
                    <Badge key={badge.label} variant={badge.variant}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <dl className="mt-7 grid gap-4 border-t border-slate-200 pt-6 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-300">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">
                      {item.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Card>
      </div>
    </header>
  );
}
