import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  DollarSign,
  MapPin,
  UsersRound,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { CompanyDetails, CompanyOpenPosition } from "@/lib/company-details-data";

type CompanyJobCardProps = {
  company: Pick<CompanyDetails, "initials" | "logoTone" | "name">;
  position: CompanyOpenPosition;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CompanyJobCard({ company, position }: CompanyJobCardProps) {
  return (
    <Card
      className={cn(
        "transition hover:border-primary/40 hover:shadow-md",
        position.featured && "border-primary/40 shadow-blue-900/10",
      )}
      contentClassName="p-5"
    >
      <article className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-md text-sm font-bold ring-1",
              company.logoTone,
            )}
            aria-hidden="true"
          >
            {company.initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {position.featured ? <Badge variant="primary">Featured</Badge> : null}
              <Badge variant="neutral">{position.department}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
              <Link
                href={position.href}
                className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {position.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm font-medium text-muted">{company.name}</p>

            <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Location</dt>
                <dd>{position.location}</dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness
                  className="size-4 text-slate-400"
                  aria-hidden="true"
                />
                <dt className="sr-only">Job type</dt>
                <dd>
                  {position.jobType} | {position.workMode}
                </dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <DollarSign className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Salary</dt>
                <dd className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {position.salary}
                </dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Posted</dt>
                <dd>{position.postedAt}</dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <UsersRound className="size-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">Applicants</dt>
                <dd>{position.applicants} applicants</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {position.skills.map((skill) => (
                <Badge key={skill} variant="neutral">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Link
          href={position.href}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          View job
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </article>
    </Card>
  );
}
