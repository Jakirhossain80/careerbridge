import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Star } from "lucide-react";

import type { CareerCategory } from "@/lib/categories-data";

import { categoryIcons } from "./category-icons";

type CategoryCardProps = {
  category: CareerCategory;
  variant?: "default" | "featured";
};

function formatJobs(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

export default function CategoryCard({
  category,
  variant = "default",
}: CategoryCardProps) {
  const Icon = categoryIcons[category.icon];
  const href = `/categories/${category.slug}`;

  if (variant === "featured") {
    return (
      <article className="group relative min-h-[280px] overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700">
        <Link
          href={href}
          className="absolute inset-0 z-20 focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label={`Explore ${category.name} jobs`}
        />
        {category.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${category.imageUrl})` }}
            role="img"
            aria-label={category.imageAlt}
          />
        ) : null}
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-5 text-white sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            {category.featured ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
                <Star className="size-3.5 fill-current" aria-hidden="true" />
                Featured
              </span>
            ) : null}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
            {category.slug}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">
            {category.name}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-100">
            {category.description}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              {formatJobs(category.availableJobs)} jobs
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold">
              Explore
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-lg ring-1 ${category.tone}`}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
        {category.featured ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900">
            <Star className="size-3.5 fill-current" aria-hidden="true" />
            Featured
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {category.slug}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          <Link
            href={href}
            className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {category.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
          {category.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <BriefcaseBusiness className="size-4 text-primary" aria-hidden="true" />
          {formatJobs(category.availableJobs)} jobs
        </span>
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-primary transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:bg-blue-950"
          aria-label={`View ${category.name} jobs`}
        >
          View
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export type { CategoryCardProps };
