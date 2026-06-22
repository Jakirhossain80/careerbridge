"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui";

type MyJobsPaginationProps = {
  currentPage: number;
  totalPages: number;
  goToPage: string;
  onGoToPageChange: (value: string) => void;
  onGoToPageSubmit: () => void;
  onPageChange: (page: number) => void;
};

export default function MyJobsPagination({
  currentPage,
  totalPages,
  goToPage,
  onGoToPageChange,
  onGoToPageSubmit,
  onPageChange,
}: MyJobsPaginationProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex items-center gap-3" aria-label="Posted jobs pages">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          leftIcon={<ChevronLeft className="size-4" aria-hidden="true" />}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <p className="text-sm text-muted" aria-live="polite">
          Page <span className="font-semibold text-foreground">{currentPage}</span>{" "}
          of <span className="font-semibold text-foreground">{totalPages}</span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          rightIcon={<ChevronRight className="size-4" aria-hidden="true" />}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </nav>

      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onGoToPageSubmit();
        }}
      >
        <label htmlFor="go-to-page" className="text-sm font-medium text-muted">
          Go to page
        </label>
        <input
          id="go-to-page"
          type="number"
          min={1}
          max={totalPages}
          value={goToPage}
          onChange={(event) => onGoToPageChange(event.target.value)}
          className="h-9 w-20 rounded-md border border-slate-300 bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900"
        />
        <Button type="submit" variant="ghost" size="sm">
          Go
        </Button>
      </form>
    </div>
  );
}
