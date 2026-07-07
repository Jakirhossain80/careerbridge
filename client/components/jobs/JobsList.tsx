"use client";

import { useQuery } from "@tanstack/react-query";

import JobCard from "@/components/jobs/JobCard";
import JobsEmptyState from "@/components/jobs/JobsEmptyState";
import JobsLoadingSkeleton from "@/components/jobs/JobsLoadingSkeleton";
import { jobs, type Job } from "@/lib/jobs-data";
import {
  getPublicJobs,
  publicJobQueryKeys,
} from "@/services/jobs.service";
import type { PublicJobsParams } from "@/types/job.types";

type JobsListProps = {
  jobs?: Job[];
  params?: PublicJobsParams;
  view?: "grid" | "list";
};

export default function JobsList({
  jobs: fallbackJobs = jobs,
  params = {},
  view = "grid",
}: JobsListProps) {
  const publicJobsQuery = useQuery({
    queryKey: publicJobQueryKeys.list(params),
    queryFn: () => getPublicJobs(params),
  });

  const jobResults = publicJobsQuery.data?.browseJobs ?? fallbackJobs;

  if (publicJobsQuery.isLoading) {
    return <JobsLoadingSkeleton />;
  }

  if (publicJobsQuery.isError || jobResults.length === 0) {
    return <JobsEmptyState />;
  }

  return (
    <section aria-labelledby="jobs-results-heading">
      <h2 id="jobs-results-heading" className="sr-only">
        Job results
      </h2>
      <div
        className={
          view === "grid"
            ? "grid gap-5 xl:grid-cols-2"
            : "grid gap-5"
        }
      >
        {jobResults.map((job) => (
          <JobCard key={job.id} job={job} view={view} />
        ))}
      </div>
    </section>
  );
}
