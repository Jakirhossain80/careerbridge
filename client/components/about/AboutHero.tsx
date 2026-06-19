import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Search } from "lucide-react";

import { aboutHeroHighlights } from "@/lib/about-data";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-x-0 top-0 h-52 bg-blue-50 dark:bg-blue-950/30" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:border-blue-900 dark:bg-slate-900">
            <BadgeCheck className="size-4" aria-hidden="true" />
            About CareerBridge
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Bridging talent and opportunity with smarter career connections.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            CareerBridge helps job seekers find roles that match their skills
            and helps employers hire with clearer candidate context.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-base font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Explore jobs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/companies"
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
            >
              Browse companies
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            {aboutHeroHighlights.map((highlight) => (
              <li key={highlight} className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-primary">
                Platform snapshot
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                One career marketplace for search, matching, and hiring.
              </h2>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
          </div>
          <div className="grid gap-4 py-5 sm:grid-cols-2">
            {[
              ["Job seekers", "Build profiles and discover matched roles."],
              ["Employers", "Post openings and review stronger shortlists."],
              ["Jobs", "Compare role details, skills, and work modes."],
              ["Companies", "Showcase culture, benefits, and open teams."],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800"
              >
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/40">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <Search className="size-4" aria-hidden="true" />
              Designed to reduce hiring noise and surface better fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
