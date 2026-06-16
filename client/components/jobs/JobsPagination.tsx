import { ChevronLeft, ChevronRight } from "lucide-react";

type JobsPaginationProps = {
  currentPage?: number;
  totalPages?: number;
  shownCount?: number;
};

export default function JobsPagination({
  currentPage = 1,
  totalPages = 4,
  shownCount = 24,
}: JobsPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-8 flex flex-col gap-4 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Jobs pagination"
    >
      <p className="text-sm text-muted">
        Page {currentPage} of {totalPages} - {shownCount} jobs shown
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === currentPage
                ? "inline-flex size-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white"
                : "inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            }
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
