import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { CareerCategory } from "@/lib/categories-data";

import { categoryIcons } from "./category-icons";

type PopularCategoriesProps = {
  categories: CareerCategory[];
};

export default function PopularCategories({
  categories,
}: PopularCategoriesProps) {
  return (
    <section className="bg-background px-6 py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Popular categories
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Start with high-demand career paths
            </h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            View all jobs
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon];

            return (
              <Link
                key={category.id}
                href={`/jobs?category=${category.slug}`}
                className="group rounded-lg border border-slate-200 bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-lg ring-1 ${category.tone}`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {category.availableJobs.toLocaleString("en-US")} open jobs
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-slate-400 transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
