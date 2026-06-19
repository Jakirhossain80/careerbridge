import { ChevronDown } from "lucide-react";

import { companies } from "@/lib/companies-data";

import CompanyCard from "./CompanyCard";

export default function CompaniesGrid() {
  return (
    <section aria-labelledby="companies-list-heading">
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="companies-list-heading" className="text-lg font-semibold">
            Explore companies
          </h2>
          <p className="mt-1 text-sm text-muted">
            Showing 1-6 of 419 verified employer profiles
          </p>
        </div>

        <label className="relative block sm:w-48">
          <span className="sr-only">Sort companies</span>
          <select
            name="sort"
            defaultValue="recommended"
            className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm font-medium text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          >
            <option value="recommended">Recommended</option>
            
            <option value="open-jobs">Most open jobs</option>
            <option value="rating">Highest rated</option>
            <option value="newest">Newest</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
