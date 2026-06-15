import type { Metadata } from "next";
import { Building2, CheckCircle2, UsersRound } from "lucide-react";

import CompaniesGrid from "@/components/companies/CompaniesGrid";
import CompaniesOfMonth from "@/components/companies/CompaniesOfMonth";
import CompaniesPagination from "@/components/companies/CompaniesPagination";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompanySearch from "@/components/companies/CompanySearch";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export const metadata: Metadata = {
  title: "Companies | CareerBridge",
  description:
    "Explore verified companies, open roles, hiring teams, and featured employers on CareerBridge.",
};

const heroStats = [
  {
    label: "Verified companies",
    value: "4.8K+",
    icon: Building2,
  },
  {
    label: "Open company roles",
    value: "18K+",
    icon: CheckCircle2,
  },
  {
    label: "Candidate follows",
    value: "35K+",
    icon: UsersRound,
  },
];

export default function CompaniesPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <section className="bg-surface px-6 py-14 dark:bg-slate-900 sm:py-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Company directory
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Find employers that match your next career move
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                  Browse verified companies, compare hiring focus, and discover
                  teams actively looking for talent across CareerBridge.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {heroStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <p className="text-sm text-muted">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <CompanySearch />
            </div>
          </div>
        </section>

        <section className="bg-background px-6 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
            <CompanyFilters />
            <div>
              <CompaniesGrid />
              <CompaniesPagination />
            </div>
          </div>
        </section>

        <CompaniesOfMonth />
      </main>
      <PublicFooter />
    </>
  );
}
