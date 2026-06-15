import { ChevronLeft, ChevronRight } from "lucide-react";

const pages = [1, 2, 3, 4];

export default function CompaniesPagination() {
  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:flex-row"
      aria-label="Companies pagination"
    >
      <p className="text-sm text-muted">Page 1 of 70</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"
          disabled
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === 1
                ? "inline-flex size-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white"
                : "inline-flex size-10 items-center justify-center rounded-md border border-slate-300 text-sm font-semibold text-foreground transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:hover:bg-slate-800"
            }
            aria-current={page === 1 ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <span className="px-1 text-sm text-muted" aria-hidden="true">
          ...
        </span>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
