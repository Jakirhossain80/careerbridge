"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import JobsEmptyState from "@/components/jobs/JobsEmptyState";
import JobsFilters from "@/components/jobs/JobsFilters";
import JobsList from "@/components/jobs/JobsList";
import JobsLoadingSkeleton from "@/components/jobs/JobsLoadingSkeleton";
import JobsPagination from "@/components/jobs/JobsPagination";
import JobsSearchBar from "@/components/jobs/JobsSearchBar";
import JobsToolbar from "@/components/jobs/JobsToolbar";
import ErrorState from "@/components/ui/ErrorState";
import { usePublicJobs } from "@/hooks/usePublicJobs";
import { readPublicJobParams, updatePublicJobParams, writePublicJobParams, type PublicJobView } from "@/lib/public-job-search";
import type { PublicJobsParams } from "@/types/job.types";

type JobsSearchResultsProps = {
  fixedParams?: PublicJobsParams;
  featured?: boolean;
  showSearchBar?: boolean;
};

export default function JobsSearchResults({ fixedParams = {}, featured = false, showSearchBar = true }: JobsSearchResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParams = useMemo(() => readPublicJobParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const params = useMemo(() => ({ ...urlParams, ...fixedParams }), [urlParams, fixedParams]);
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const jobsQuery = usePublicJobs(params, featured);

  function navigate(next: PublicJobsParams, nextView: PublicJobView = view) {
    const query = writePublicJobParams(next);
    if (nextView === "list") query.set("view", "list");
    const value = query.toString();
    router.push(value ? `${pathname}?${value}` : pathname, { scroll: false });
  }

  function update(updates: Partial<PublicJobsParams>, resetPage = true) {
    navigate(updatePublicJobParams(urlParams, updates, resetPage));
  }

  function reset() {
    navigate({}, "grid");
  }

  const data = jobsQuery.data;
  const jobs = data?.browseJobs ?? [];

  return (
    <>
      {showSearchBar ? <section className="-mt-8 bg-transparent px-6"><div className="mx-auto w-full max-w-6xl"><JobsSearchBar key={searchParams.toString()} values={urlParams} onSubmit={(values) => update(values)} /></div></section> : null}
      <section className="bg-background px-6 py-12">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
          <JobsFilters values={params} onChange={(updates) => update(updates)} onReset={reset} />
          <div>
            {jobsQuery.isLoading ? <JobsLoadingSkeleton /> : null}
            {jobsQuery.isError ? <ErrorState title="Unable to load jobs" message="The job search could not be loaded. Please try again." onRetry={() => jobsQuery.refetch()} /> : null}
            {jobsQuery.isSuccess && data ? <>
              <JobsToolbar count={jobs.length} total={data.meta.total} sort={params.sort ?? "-createdAt"} view={view} onSortChange={(sort) => update({ sort })} onViewChange={(nextView) => navigate(urlParams, nextView)} />
              {jobs.length === 0 ? <JobsEmptyState onClear={reset} /> : <JobsList jobs={jobs} view={view} />}
              <JobsPagination currentPage={data.meta.page} totalPages={data.meta.totalPages} shownCount={jobs.length} total={data.meta.total} onPageChange={(page) => update({ page }, false)} />
            </> : null}
          </div>
        </div>
      </section>
    </>
  );
}
