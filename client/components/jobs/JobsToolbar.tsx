import { ArrowUpDown, LayoutGrid, List } from "lucide-react";

import { sortOptions } from "@/lib/jobs-data";

export default function JobsToolbar() {
  return (
    <div className="mb-5 flex flex-col gap-4 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Showing 6 jobs
        </p>
        <p className="mt-1 text-sm text-muted">
          Matched from 18,000+ active openings
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block">
          <span className="sr-only">Sort jobs</span>
          <ArrowUpDown
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <select
            name="sort"
            defaultValue="Latest"
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:w-48"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <div
          className="grid grid-cols-2 rounded-md border border-slate-200 bg-background p-1 dark:border-slate-700"
          aria-label="Choose job results view"
        >
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-semibold text-white"
            aria-pressed="true"
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            Grid
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded px-3 text-sm font-semibold text-muted transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-pressed="false"
          >
            <List className="size-4" aria-hidden="true" />
            List
          </button>
        </div>
      </div>
    </div>
  );
}
