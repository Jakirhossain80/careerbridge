import type { Metadata } from "next";

import JobsFilters from "@/components/jobs/JobsFilters";
import JobsHero from "@/components/jobs/JobsHero";
import JobsList from "@/components/jobs/JobsList";
import JobsPagination from "@/components/jobs/JobsPagination";
import JobsSearchBar from "@/components/jobs/JobsSearchBar";
import JobsToolbar from "@/components/jobs/JobsToolbar";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import type { PublicJobsParams } from "@/types/job.types";

export const metadata: Metadata = {
  title: "Jobs | CareerBridge",
  description:
    "Search verified jobs by title, company, skill, keyword, location, salary, work mode, and experience level on CareerBridge.",
};

type JobsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const getSearchParam = (
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = searchParams[key];

  return Array.isArray(value) ? value[0] : value;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const publicJobParams: PublicJobsParams = {
    search: getSearchParam(resolvedSearchParams, "search"),
    keyword: getSearchParam(resolvedSearchParams, "keyword"),
    title: getSearchParam(resolvedSearchParams, "title"),
    company: getSearchParam(resolvedSearchParams, "company"),
    skill: getSearchParam(resolvedSearchParams, "skill"),
    location: getSearchParam(resolvedSearchParams, "location"),
    category: getSearchParam(resolvedSearchParams, "category"),
    sort:
      getSearchParam(resolvedSearchParams, "sort") === "oldest"
        ? "createdAt"
        : "-createdAt",
  };

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
              <JobsList params={publicJobParams} />

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Load more jobs
                </button>
              </div>

              <JobsPagination />
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
