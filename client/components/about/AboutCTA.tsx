import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Ready to move forward?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Find your next role or connect with qualified talent.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Use CareerBridge to discover verified jobs, compare companies, and
            build hiring connections with more clarity.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link
            href="/jobs"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-base font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Browse jobs
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/companies"
            className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            View companies
          </Link>
        </div>
      </div>
    </section>
  );
}
