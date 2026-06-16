"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

import type { CareerCategory } from "@/lib/categories-data";

type CategoriesSearchProps = {
  categories: CareerCategory[];
};

export default function CategoriesSearch({ categories }: CategoriesSearchProps) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories.slice(0, 4);
    }

    return categories
      .filter((category) =>
        [category.name, category.slug, category.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 5);
  }, [categories, query]);

  return (
    <section className="-mt-8 bg-transparent px-6" aria-label="Search categories">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm dark:border-slate-700">
          <form
            role="search"
            aria-label="Search job categories"
            className="grid gap-3 md:grid-cols-[1fr_auto]"
          >
            <label className="relative block">
              <span className="sr-only">Search categories</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                name="category"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by category, skill area, or slug"
                className="h-12 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </label>

            <Link
              href={query.trim() ? `/jobs?category=${encodeURIComponent(query.trim())}` : "/jobs"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Search jobs
            </Link>
          </form>

          <div className="mt-3 flex flex-wrap gap-2" aria-live="polite">
            {matches.length > 0 ? (
              matches.map((category) => (
                <Link
                  key={category.id}
                  href={`/jobs?category=${category.slug}`}
                  className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-950"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <p className="px-1 py-2 text-sm text-muted">
                No matching categories found.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
