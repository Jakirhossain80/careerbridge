import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  Edit3,
  ExternalLink,
  MapPin,
  UsersRound,
} from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type CompanyProfileHeroProps = {
  company: CompanyProfile;
};

export default function CompanyProfileHero({ company }: CompanyProfileHeroProps) {
  return (
    <section aria-labelledby="company-profile-heading">
      <div
        className="relative min-h-52 overflow-hidden rounded-lg bg-gradient-to-br from-blue-950 via-blue-700 to-emerald-500 shadow-sm sm:min-h-64"
        role="img"
        aria-label={`${company.companyName} company banner`}
        style={{ backgroundImage: `url(${company.bannerUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-700/80 to-emerald-500/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.24),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.16),transparent_45%)]" />
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <Button
            variant="outline"
            className="border-white/40 bg-white/95 text-slate-900 hover:bg-white"
            leftIcon={<Edit3 className="size-4" aria-hidden="true" />}
            aria-label={`Edit ${company.companyName} profile`}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="relative -mt-14 rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blue-50 text-2xl font-bold text-primary shadow-sm ring-4 ring-surface dark:border-slate-700 dark:bg-slate-800 sm:size-28">
              <Image
                src={company.logoUrl}
                alt={`${company.companyName} logo`}
                width={112}
                height={112}
                className="size-full object-cover"
              />
            </div>

            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  id="company-profile-heading"
                  className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  {company.companyName}
                </h1>
                {company.verified ? (
                  <Badge variant="success" className="gap-1">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Verified
                  </Badge>
                ) : null}
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                {company.tagline}
              </p>

              <dl className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
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
                <div className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                  <dt className="sr-only">Headquarters</dt>
                  <dd>{company.headquarters}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-48">
            <Badge variant="primary" className="w-fit">
              {company.hiringStatus}
            </Badge>
            <Link
              href={company.website}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
            >
              Company Website
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
