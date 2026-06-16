import Link from "next/link";
import { ArrowRight, BellRing, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";
import type { CompanyDetails } from "@/lib/company-details-data";

type TalentPoolCardProps = {
  company: CompanyDetails;
};

export default function TalentPoolCard({ company }: TalentPoolCardProps) {
  return (
    <Card contentClassName="p-6">
      <aside aria-labelledby="talent-pool-heading">
        <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <BellRing className="size-5" aria-hidden="true" />
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
          {company.talentPool.eyebrow}
        </p>
        <h2
          id="talent-pool-heading"
          className="mt-2 text-xl font-bold tracking-tight text-foreground"
        >
          {company.talentPool.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {company.talentPool.description}
        </p>

        <div className="mt-5 rounded-lg bg-background p-4 dark:bg-slate-800/70">
          <div className="flex items-center gap-3">
            <UsersRound className="size-5 text-slate-400" aria-hidden="true" />
            <div>
              <p className="text-lg font-bold text-foreground">
                {company.followers}
              </p>
              <p className="text-sm text-muted">people following this company</p>
            </div>
          </div>
        </div>

        <Link
          href={company.talentPool.href}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Join talent pool
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </aside>
    </Card>
  );
}
