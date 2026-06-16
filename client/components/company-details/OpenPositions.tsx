import Link from "next/link";
import { Filter, Search } from "lucide-react";

import CompanyJobCard from "@/components/company-details/CompanyJobCard";
import type { CompanyDetails } from "@/lib/company-details-data";

type OpenPositionsProps = {
  company: CompanyDetails;
};

export default function OpenPositions({ company }: OpenPositionsProps) {
  return (
    <section aria-labelledby="open-positions-heading">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Open opportunities
          </p>
          <h2
            id="open-positions-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-foreground"
          >
            Jobs at {company.name}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {company.openPositionsCount} open positions across product,
            engineering, and operations.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
        >
          <Filter className="size-4" aria-hidden="true" />
          Filter
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm dark:border-slate-700">
        <Search className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span>Search roles by keyword, team, or work mode</span>
      </div>

      <div className="grid gap-4">
        {company.positions.map((position) => (
          <CompanyJobCard
            key={position.id}
            company={company}
            position={position}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href={`/jobs?company=${company.id}`}
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
        >
          View all positions
        </Link>
      </div>
    </section>
  );
}
