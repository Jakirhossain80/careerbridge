"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Pagination from "@/components/ui/Pagination";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function BlogPagination({
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className="mt-8 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700"
    />
  );
}

export type { BlogPaginationProps };
