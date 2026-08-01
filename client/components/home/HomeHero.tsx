import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-x-0 top-0 h-48 bg-blue-50 dark:bg-blue-950/30" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:border-blue-900 dark:bg-slate-900">
            <Sparkles className="size-4" aria-hidden="true" />
            Build your path from learning to work
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find the right job and bridge your next career move.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Search verified roles, compare opportunities, and connect your
            practical skills with companies that are ready to hire.
          </p>

          <form
            role="search"
            aria-label="Search jobs"
            action="/jobs"
            className="mt-8 rounded-lg border border-slate-200 bg-white p-3 shadow-lg shadow-blue-900/10 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_auto]">
              <label className="relative block">
                <span className="sr-only">Job title or keyword</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="keyword"
                  placeholder="Job title or keyword"
                  className="h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 pl-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Location</span>
                <MapPin
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-4 pl-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-sm shadow-blue-900/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Search Jobs
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
              Verified companies
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
              Skill-based matching
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
              Remote and local roles
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Featured match
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Frontend Engineer
                </h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
                <BriefcaseBusiness className="size-6" aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-4 py-5">
              {[
                ["Match score", "94%"],
                ["Work mode", "Hybrid"],
                ["Experience", "2-4 years"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800"
                >
                  <span className="text-sm text-muted">{label}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/40">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Your profile is ready for 128 similar roles.
              </p>
              <Link
                href="/jobs"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
              >
                Browse opportunities
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
