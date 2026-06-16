import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";
import type { JobDetails } from "@/lib/job-details-data";

type CompanyProfileCardProps = {
  job: JobDetails;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CompanyProfileCard({ job }: CompanyProfileCardProps) {
  return (
    <Card contentClassName="p-6">
      <aside aria-labelledby="company-profile-heading">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-lg ring-1",
              job.companyTone,
            )}
            aria-hidden="true"
          >
            <span className="font-bold">{job.companyInitials}</span>
          </div>
          <div>
            <h2
              id="company-profile-heading"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              {job.company}
            </h2>
            <p className="mt-1 text-sm text-muted">{job.companyIndustry}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-muted">
          {job.companyDescription}
        </p>

        <dl className="mt-5 grid gap-3 text-sm text-muted">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">Company location</dt>
            <dd>{job.companyLocation}</dd>
          </div>
          <div className="flex items-center gap-2">
            <UsersRound className="size-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">Company size</dt>
            <dd>{job.companySize}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">Industry</dt>
            <dd>{job.companyIndustry}</dd>
          </div>
        </dl>

        <Link
          href={job.companyProfileHref}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
        >
          Company profile
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </aside>
    </Card>
  );
}
