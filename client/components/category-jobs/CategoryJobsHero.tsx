import Link from "next/link";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui";
import type { CategoryJobsData } from "@/lib/category-jobs-data";

type CategoryJobsHeroProps = {
  data: CategoryJobsData;
};

export default function CategoryJobsHero({ data }: CategoryJobsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-16 text-white sm:py-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${data.heroImageUrl})` }}
        role="img"
        aria-label={data.heroImageAlt}
      />
      <div className="absolute inset-0 bg-slate-950/65" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
              <li>
                <Link
                  href="/"
                  className="font-medium transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li>
                <Link
                  href="/categories"
                  className="font-medium transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Categories
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li className="font-semibold text-white" aria-current="page">
                {data.eyebrow}
              </li>
            </ol>
          </nav>

          <div className="mt-10 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              {data.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {data.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              {data.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2" aria-label="Category tags">
              {data.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="neutral"
                  className="border-white/20 bg-white/10 text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
            >
              <dt className="text-sm font-medium text-slate-200">{stat.label}</dt>
              <dd className="mt-2 text-2xl font-bold tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
