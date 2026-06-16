import Link from "next/link";
import { ClipboardCheck, Search } from "lucide-react";

export default function CategoriesCTA() {
  return (
    <section className="bg-surface px-6 py-14 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Need a better match?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Take a short assessment to identify roles that fit your skills, or
              browse the full jobs directory with filters.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <ClipboardCheck className="size-4" aria-hidden="true" />
              Take assessment
            </Link>
            <Link
              href="/jobs"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
            >
              <Search className="size-4" aria-hidden="true" />
              Browse jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
