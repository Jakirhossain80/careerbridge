import Link from "next/link";
import { ChevronRight, Globe2, MapPin, UsersRound } from "lucide-react";

import CompanyAboutCard from "@/components/employer-company-profile/CompanyAboutCard";
import CompanyContactCard from "@/components/employer-company-profile/CompanyContactCard";
import CompanyHighlights from "@/components/employer-company-profile/CompanyHighlights";
import CompanyProfileHero from "@/components/employer-company-profile/CompanyProfileHero";
import EmployerVerificationCard from "@/components/employer-company-profile/EmployerVerificationCard";
import OpenRolesCard from "@/components/employer-company-profile/OpenRolesCard";
import { Card } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type CompanyProfileOverviewProps = {
  company: CompanyProfile;
};

export default function CompanyProfileOverview({
  company,
}: CompanyProfileOverviewProps) {
  const details = [
    { label: "Industry", value: company.industry, icon: Globe2 },
    { label: "Company size", value: company.companySize, icon: UsersRound },
    { label: "Headquarters", value: company.headquarters, icon: MapPin },
  ];

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="transition hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li>
              <Link
                href="/employer/dashboard"
                className="transition hover:text-primary"
              >
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              Company Profile
            </li>
          </ol>
        </nav>

        <CompanyProfileHero company={company} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <CompanyAboutCard company={company} />

            <Card
              header={
                <h2 className="text-lg font-semibold text-foreground">
                  Company details
                </h2>
              }
            >
              <dl className="grid gap-4 sm:grid-cols-3">
                {details.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
                    >
                      <dt className="flex items-center gap-2 text-sm font-medium text-muted">
                        <Icon className="size-4" aria-hidden="true" />
                        {item.label}
                      </dt>
                      <dd className="mt-2 font-semibold text-foreground">
                        {item.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Card>

            <CompanyHighlights company={company} />
          </div>

          <aside className="flex flex-col gap-6" aria-label="Company profile summaries">
            <OpenRolesCard company={company} />
            <EmployerVerificationCard company={company} />
            <CompanyContactCard company={company} />
          </aside>
        </div>
      </div>
    </main>
  );
}
