import { Search, SlidersHorizontal } from "lucide-react";

export default function CompanySearch() {
  return (
    <form
      role="search"
      className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm dark:border-slate-700"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <label className="relative block">
          <span className="sr-only">Search companies</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            name="query"
            placeholder="Search by company, industry, or skill"
            className="h-12 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
        </label>

        <label className="block">
          <span className="sr-only">Location</span>
          <input
            type="search"
            name="location"
            placeholder="Location"
            className="h-12 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Find companies
        </button>
      </div>
    </form>
  );
}
