"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, Crown, RefreshCcw } from "lucide-react";

import RecommendedJobsFilters from "@/components/job-seeker/recommended-jobs/RecommendedJobsFilters";
import RecommendedJobsHeader from "@/components/job-seeker/recommended-jobs/RecommendedJobsHeader";
import RecommendedJobsList from "@/components/job-seeker/recommended-jobs/RecommendedJobsList";
import { FilterEmptyState, SearchEmptyState } from "@/components/empty-states";
import { JobCardSkeleton } from "@/components/skeletons";
import { Button, Card, EmptyState, Pagination, SearchBar } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { getRecommendedJobs } from "@/services/recommended-jobs.service";
import { saveJob, unsaveJob } from "@/services/saved-jobs.service";
import type {
  RecommendedJob,
  RecommendedJobsQueryParams,
  RecommendedJobsSortBy,
} from "@/types/recommended-job.types";

const initialFilters: RecommendedJobsQueryParams = {
  sortBy: "relevance",
  page: 1,
  limit: 6,
};

function removeEmptyFilters(params: RecommendedJobsQueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined),
  ) as RecommendedJobsQueryParams;
}

export default function RecommendedJobsContent() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<RecommendedJobsQueryParams>(initialFilters);
  const [searchDraft, setSearchDraft] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savingJobId, setSavingJobId] = useState<string>();

  const queryParams = useMemo(() => removeEmptyFilters(filters), [filters]);

  const recommendedJobsQuery = useQuery({
    queryKey: ["recommended-jobs", queryParams],
    queryFn: () => getRecommendedJobs(queryParams),
  });

  const invalidateJobSeekerQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["recommended-jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["job-seeker-dashboard"] }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: saveJob,
    onMutate: (jobId) => {
      setSavingJobId(jobId);
      setSuccessMessage("");
      setErrorMessage("");
    },
    onSuccess: async () => {
      setSuccessMessage("Job saved successfully.");
      await invalidateJobSeekerQueries();
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error) || "Unable to save job.");
    },
    onSettled: () => setSavingJobId(undefined),
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveJob,
    onMutate: (jobId) => {
      setSavingJobId(jobId);
      setSuccessMessage("");
      setErrorMessage("");
    },
    onSuccess: async () => {
      setSuccessMessage("Job removed from saved jobs.");
      await invalidateJobSeekerQueries();
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error) || "Unable to remove saved job.");
    },
    onSettled: () => setSavingJobId(undefined),
  });

  const data = recommendedJobsQuery.data;
  const jobs = data?.jobs ?? [];
  const activeSearch = filters.search?.trim();
  const hasActiveFilters = Boolean(
      filters.category ||
      filters.location ||
      filters.employmentType ||
      filters.workMode ||
      filters.experienceLevel ||
      filters.salaryMin ||
      filters.salaryMax,
  );

  function updateFilters(updates: Partial<RecommendedJobsQueryParams>) {
    setFilters((current) => ({
      ...current,
      ...updates,
      page: 1,
    }));
  }

  function handleToggleSave(job: RecommendedJob) {
    if (job.isSaved) {
      unsaveMutation.mutate(job.savedJobId ?? job._id);
      return;
    }

    saveMutation.mutate(job._id);
  }

  return (
    <main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-6">
          <RecommendedJobsHeader
            total={data?.total ?? 0}
            sortBy={filters.sortBy ?? "relevance"}
            onSortChange={(sortBy: RecommendedJobsSortBy) => updateFilters({ sortBy })}
            onToggleFilters={() => setShowMobileFilters((value) => !value)}
          />

          <Card contentClassName="p-4">
            <SearchBar
              value={searchDraft}
              onChange={(value) => {
                setSearchDraft(value);
                if (!value) {
                  updateFilters({ search: undefined });
                }
              }}
              onSubmit={(value) => updateFilters({ search: value.trim() || undefined })}
              placeholder="Search title, company, skill, or keyword"
              label="Search recommended jobs"
            />
          </Card>

          {successMessage ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
            <RecommendedJobsFilters
              filters={filters}
              onChange={updateFilters}
              onReset={() => {
                setSearchDraft("");
                setFilters(initialFilters);
              }}
              className={showMobileFilters ? "block" : "hidden lg:block"}
            />

            <div className="min-w-0">
              {recommendedJobsQuery.isLoading ? (
                <JobCardSkeleton count={3} />
              ) : null}

              {recommendedJobsQuery.isError ? (
                <Card>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold text-foreground">
                        Unable to load recommended jobs.
                      </h2>
                      <p className="mt-1 text-sm text-muted">Please try again.</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => recommendedJobsQuery.refetch()}
                      leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
                    >
                      Retry
                    </Button>
                  </div>
                </Card>
              ) : null}

              {!recommendedJobsQuery.isLoading &&
              !recommendedJobsQuery.isError &&
              jobs.length === 0 ? (
                activeSearch ? (
                  <SearchEmptyState
                    query={activeSearch}
                    onClear={() => {
                      setSearchDraft("");
                      updateFilters({ search: undefined });
                    }}
                  />
                ) : hasActiveFilters ? (
                  <FilterEmptyState
                    onClear={() => {
                      setSearchDraft("");
                      setFilters(initialFilters);
                    }}
                  />
                ) : (
                  <EmptyState
                    title="No recommended jobs found."
                    description="Update your profile skills and preferences to improve job recommendations."
                    actionLabel="Edit Profile"
                    actionHref="/job-seeker/profile/edit"
                    icon={<BriefcaseBusiness className="size-6" aria-hidden="true" />}
                  />
                )
              ) : null}

              {jobs.length > 0 ? (
                <>
                  <RecommendedJobsList
                    jobs={jobs}
                    savingJobId={savingJobId}
                    onToggleSave={handleToggleSave}
                    onApplicationSubmitted={async () => {
                      setSuccessMessage("Application submitted successfully.");
                      await Promise.all([
                        queryClient.invalidateQueries({ queryKey: ["recommended-jobs"] }),
                        queryClient.invalidateQueries({ queryKey: ["applied-jobs"] }),
                        queryClient.invalidateQueries({
                          queryKey: ["job-seeker-dashboard"],
                        }),
                      ]);
                    }}
                  />

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Pagination
                      currentPage={data?.page ?? filters.page ?? 1}
                      totalPages={data?.totalPages ?? 1}
                      onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
                      className="w-full sm:w-auto"
                    />
                    <Link href="/jobs">
                      <Button type="button" variant="outline">
                        View All Recommended Jobs
                      </Button>
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <Card contentClassName="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Crown className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Pro Upgrade</h2>
                <p className="mt-1 text-sm text-muted">
                  Unlock deeper match insights and priority profile visibility.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
