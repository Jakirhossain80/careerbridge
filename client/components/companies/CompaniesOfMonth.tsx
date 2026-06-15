import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui";
import { companiesOfMonth } from "@/lib/companies-data";

export default function CompaniesOfMonth() {
  return (
    <section className="bg-surface px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Companies of the month
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hiring teams candidates keep watching
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Featured employers with active hiring plans, strong response rates,
              and clear career paths.
            </p>
          </div>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
          >
            View all featured
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {companiesOfMonth.map((company) => (
            <article
              key={company.id}
              className="rounded-lg border border-slate-200 bg-background p-5 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="primary">Featured employer</Badge>
                  <h3 className="mt-4 font-heading text-xl font-semibold">
                    {company.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{company.industry}</p>
                </div>
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-lg text-base font-bold ring-1 ${company.logoTone}`}
                  aria-hidden="true"
                >
                  {company.initials}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted">
                {company.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {company.workModes.map((mode) => (
                  <Badge key={mode} variant="neutral">
                    {mode}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                <span className="text-sm font-semibold text-foreground">
                  {company.openJobs} open roles
                </span>
                <Link
                  href={company.href}
                  className="text-sm font-semibold text-primary transition hover:text-blue-700"
                >
                  View profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
