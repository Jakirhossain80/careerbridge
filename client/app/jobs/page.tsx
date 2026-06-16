import type { Metadata } from "next";

import JobsEmptyState from "@/components/jobs/JobsEmptyState";
import JobsFilters from "@/components/jobs/JobsFilters";
import JobsHero from "@/components/jobs/JobsHero";
import JobsList from "@/components/jobs/JobsList";
import JobsLoadingSkeleton from "@/components/jobs/JobsLoadingSkeleton";
import JobsPagination from "@/components/jobs/JobsPagination";
import JobsSearchBar from "@/components/jobs/JobsSearchBar";
import JobsToolbar from "@/components/jobs/JobsToolbar";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export const metadata: Metadata = {
  title: "Jobs | CareerBridge",
  description:
    "Search verified jobs by title, company, skill, keyword, location, salary, work mode, and experience level on CareerBridge.",
};

export default function JobsPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <JobsHero />

        <section className="-mt-8 bg-transparent px-6">
          <div className="mx-auto w-full max-w-6xl">
            <JobsSearchBar />
          </div>
        </section>

        <section className="bg-background px-6 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            <JobsFilters />

            <div>
              <JobsToolbar />
              <JobsList />

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Load more jobs
                </button>
              </div>

              <JobsPagination />

              <div className="mt-8 grid gap-6">
                <JobsEmptyState />
                <JobsLoadingSkeleton />
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
