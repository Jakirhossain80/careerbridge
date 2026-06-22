"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Grid2X2, List, Plus, Search } from "lucide-react";

import MyJobsEmptyState from "@/components/employer-jobs/my-jobs/MyJobsEmptyState";
import MyJobsLoadingState from "@/components/employer-jobs/my-jobs/MyJobsLoadingState";
import MyJobsPagination from "@/components/employer-jobs/my-jobs/MyJobsPagination";
import MyJobsTable from "@/components/employer-jobs/my-jobs/MyJobsTable";
import MyJobsTabs from "@/components/employer-jobs/my-jobs/MyJobsTabs";
import { Button } from "@/components/ui";
import type {
  EmployerJobVisibility,
  EmployerPostedJob,
  EmployerPostedJobStatus,
} from "@/types/employer-job";

type MyPostedJobsPageProps = {
  initialJobs: EmployerPostedJob[];
};

type JobsTab = "all" | "active" | "inactive" | "draft";
type ViewMode = "list" | "grid";

const jobsPerPage = 5;

export default function MyPostedJobsPage({
  initialJobs,
}: MyPostedJobsPageProps) {
  const [activeTab, setActiveTab] = useState<JobsTab>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState(initialJobs);
  const [isLoading] = useState(false);

  const tabCounts = useMemo(
    () => ({
      all: jobs.length,
      active: jobs.filter((job) => job.status === "active").length,
      inactive: jobs.filter((job) => job.status === "inactive").length,
      draft: jobs.filter((job) => job.status === "draft").length,
    }),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const statusFilteredJobs =
      activeTab === "all"
        ? jobs
        : jobs.filter((job) => job.status === activeTab);

    if (!normalizedQuery) {
      return statusFilteredJobs;
    }

    return statusFilteredJobs.filter((job) =>
      [job.title, job.category, job.location, job.jobType, job.workMode].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [activeTab, jobs, searchQuery]);

  const totalPages = Math.max(Math.ceil(filteredJobs.length / jobsPerPage), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * jobsPerPage;
  const visibleJobs = filteredJobs.slice(pageStart, pageStart + jobsPerPage);

  function handleTabChange(nextTab: JobsTab) {
    setActiveTab(nextTab);
    setCurrentPage(1);
  }

  function handleVisibilityChange(
    jobId: string,
    visibility: EmployerJobVisibility,
  ) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId ? { ...job, visibility } : job,
      ),
    );
  }

  function handleArchive(jobId: string) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: "archived" as EmployerPostedJobStatus }
          : job,
      ),
    );
  }

  function handleGoToPage() {
    const nextPage = Number(goToPage);

    if (!Number.isInteger(nextPage)) {
      return;
    }

    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
    setGoToPage("");
  }

  const rangeStart = filteredJobs.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + visibleJobs.length, filteredJobs.length);

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Employer workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Posted Jobs
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Manage job visibility, review applicants, continue drafts, and keep
              open roles up to date.
            </p>
          </div>

          <Link href="/employer/dashboard/jobs/new">
            <Button
              type="button"
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              Post New Job
            </Button>
          </Link>
        </div>
      </header>

      <section
        aria-labelledby="posted-jobs-heading"
        className="rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700"
      >
        <div className="border-b border-slate-200 p-4 dark:border-slate-700 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2
                id="posted-jobs-heading"
                className="text-lg font-semibold text-foreground"
              >
                Posted jobs
              </h2>
              <p className="mt-1 text-sm text-muted" aria-live="polite">
                Showing {rangeStart}-{rangeEnd} of {filteredJobs.length} jobs
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search jobs"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 sm:w-64"
                  aria-label="Search posted jobs"
                />
              </div>

              <div
                className="inline-flex rounded-md border border-slate-200 bg-background p-1 dark:border-slate-700"
                aria-label="Choose jobs view"
              >
                <button
                  type="button"
                  className={`rounded px-3 py-2 text-sm font-semibold transition ${
                    viewMode === "list"
                      ? "bg-surface text-primary shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" aria-hidden="true" />
                  <span className="sr-only">List view</span>
                </button>
                <button
                  type="button"
                  className={`rounded px-3 py-2 text-sm font-semibold transition ${
                    viewMode === "grid"
                      ? "bg-surface text-primary shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 className="size-4" aria-hidden="true" />
                  <span className="sr-only">Grid view</span>
                </button>
              </div>
            </div>
          </div>

          <MyJobsTabs
            activeTab={activeTab}
            counts={tabCounts}
            onTabChange={handleTabChange}
          />
        </div>

        {isLoading ? (
          <MyJobsLoadingState />
        ) : visibleJobs.length > 0 ? (
          <>
            <MyJobsTable
              jobs={visibleJobs}
              viewMode={viewMode}
              onArchive={handleArchive}
              onVisibilityChange={handleVisibilityChange}
            />
            <MyJobsPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              onGoToPageChange={setGoToPage}
              onGoToPageSubmit={handleGoToPage}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <MyJobsEmptyState activeTab={activeTab} />
        )}
      </section>
    </div>
  );
}

export type { JobsTab, ViewMode };
