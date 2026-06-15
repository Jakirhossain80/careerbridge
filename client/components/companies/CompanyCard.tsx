import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui";
import type { Company } from "@/lib/companies-data";

type CompanyCardProps = {
  company: Company;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-surface p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-lg text-base font-bold ring-1",
            company.logoTone,
          )}
          aria-hidden="true"
        >
          {company.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={company.href}
                className="line-clamp-1 font-heading text-lg font-semibold text-foreground transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {company.name}
              </Link>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Building2 className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{company.industry}</span>
              </p>
            </div>

            {company.verified ? (
              <Badge variant="success" className="shrink-0 gap-1">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Verified
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted">
        {company.description}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/70">
          <dt className="flex items-center gap-1.5 text-muted">
            <MapPin className="size-4" aria-hidden="true" />
            Location
          </dt>
          <dd className="mt-1 font-semibold text-foreground">{company.location}</dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/70">
          <dt className="flex items-center gap-1.5 text-muted">
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            Open jobs
          </dt>
          <dd className="mt-1 font-semibold text-foreground">
            {company.openJobs} roles
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/70">
          <dt className="flex items-center gap-1.5 text-muted">
            <Users className="size-4" aria-hidden="true" />
            Team size
          </dt>
          <dd className="mt-1 font-semibold text-foreground">
            {company.employees}
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/70">
          <dt className="flex items-center gap-1.5 text-muted">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            Rating
          </dt>
          <dd className="mt-1 font-semibold text-foreground">{company.rating}/5</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        {company.tags.map((tag) => (
          <Badge key={tag} variant="neutral">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <span className="text-sm text-muted">Founded {company.founded}</span>
        <Link
          href={company.href}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
