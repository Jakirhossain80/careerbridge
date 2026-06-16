import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Share2,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui";
import type { CompanyDetails } from "@/lib/company-details-data";

type CompanyHeroProps = {
  company: CompanyDetails;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CompanyHero({ company }: CompanyHeroProps) {
  return (
    <section aria-labelledby="company-heading" className="bg-background px-6 pt-8">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className={cn(
            "relative min-h-56 overflow-hidden rounded-lg bg-gradient-to-br shadow-sm sm:min-h-72",
            company.coverTone,
          )}
          aria-label={`${company.name} cover image`}
          role="img"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_42%)]" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 text-white">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                Company profile
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-50 sm:text-base">
                {company.tagline}
              </p>
            </div>
            <div className="hidden rounded-lg border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur sm:block">
              {company.openPositionsCount} open roles
            </div>
          </div>
        </div>

        <div className="relative -mt-12 rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className={cn(
                  "flex size-24 shrink-0 items-center justify-center rounded-lg text-3xl font-bold ring-1 shadow-sm",
                  company.logoTone,
                )}
                aria-hidden="true"
              >
                {company.initials}
              </div>

              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1
                    id="company-heading"
                    className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                  >
                    {company.name}
                  </h1>
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    Verified
                  </Badge>
                </div>

                <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                  <div className="inline-flex items-center gap-2">
                    <Building2 className="size-4 text-slate-400" aria-hidden="true" />
                    <dt className="sr-only">Industry</dt>
                    <dd>{company.industry}</dd>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <UsersRound className="size-4 text-slate-400" aria-hidden="true" />
                    <dt className="sr-only">Company size</dt>
                    <dd>{company.companySize}</dd>
                  </div>
                </dl>

                <p className="mt-3 text-sm text-muted">
                  {company.followers} followers | Founded {company.founded}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:pt-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <UsersRound className="size-4" aria-hidden="true" />
                Follow Company
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
              >
                <Share2 className="size-4" aria-hidden="true" />
                Share
              </button>
              <Link
                href={company.website}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
              >
                Website
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
