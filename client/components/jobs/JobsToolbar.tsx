"use client";

import { ArrowUpDown, LayoutGrid, List } from "lucide-react";

type JobsToolbarProps = {
  count: number;
  total: number;
  sort: string;
  view: "grid" | "list";
  onSortChange: (sort: string) => void;
  onViewChange: (view: "grid" | "list") => void;
};

const options = [
  { label: "Latest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Salary high to low", value: "-salaryMin" },
  { label: "Salary low to high", value: "salaryMin" },
  { label: "Most applied", value: "-applicationsCount" },
];

export default function JobsToolbar({ count, total, sort, view, onSortChange, onViewChange }: JobsToolbarProps) {
  return (
    <div className="mb-5 flex flex-col gap-4 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div aria-live="polite"><p className="text-sm font-semibold text-foreground">Showing {count} {count === 1 ? "job" : "jobs"}</p><p className="mt-1 text-sm text-muted">{total} total matching {total === 1 ? "opening" : "openings"}</p></div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block"><span className="sr-only">Sort jobs</span><ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><select name="sort" value={sort} onChange={(event) => onSortChange(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:w-48">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-background p-1 dark:border-slate-700" aria-label="Choose job results view">
          <button type="button" onClick={() => onViewChange("grid")} className={view === "grid" ? "inline-flex h-9 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-semibold text-white" : "inline-flex h-9 items-center justify-center gap-2 rounded px-3 text-sm font-semibold text-muted transition hover:bg-slate-100 dark:hover:bg-slate-800"} aria-pressed={view === "grid"}><LayoutGrid className="size-4" aria-hidden="true" />Grid</button>
          <button type="button" onClick={() => onViewChange("list")} className={view === "list" ? "inline-flex h-9 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-semibold text-white" : "inline-flex h-9 items-center justify-center gap-2 rounded px-3 text-sm font-semibold text-muted transition hover:bg-slate-100 dark:hover:bg-slate-800"} aria-pressed={view === "list"}><List className="size-4" aria-hidden="true" />List</button>
        </div>
      </div>
    </div>
  );
}
