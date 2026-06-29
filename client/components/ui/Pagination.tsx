import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "./Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const isFirstPage = safeCurrentPage <= 1;
  const isLastPage = safeCurrentPage >= safeTotalPages;

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-between gap-3", className)}
      aria-label="Pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(safeCurrentPage - 1)}
        disabled={isFirstPage}
        leftIcon={<ChevronLeft className="size-4" aria-hidden="true" />}
      >
        Previous
      </Button>

      <p className="text-sm text-muted" aria-live="polite">
        Page{" "}
        <span className="font-semibold text-foreground">{safeCurrentPage}</span>{" "}
        of <span className="font-semibold text-foreground">{safeTotalPages}</span>
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(safeCurrentPage + 1)}
        disabled={isLastPage}
        rightIcon={<ChevronRight className="size-4" aria-hidden="true" />}
      >
        Next
      </Button>
    </nav>
  );
}

export type { PaginationProps };
