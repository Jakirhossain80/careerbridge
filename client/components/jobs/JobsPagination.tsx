"use client";

import { Pagination } from "@/components/ui";

type JobsPaginationProps = {
  currentPage: number;
  totalPages: number;
  shownCount: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function JobsPagination({ currentPage, totalPages, shownCount, total, onPageChange }: JobsPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700">
      <p className="mb-4 text-sm text-muted">{shownCount} of {total} jobs shown</p>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
