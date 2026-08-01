"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { JobCard } from "@/components/cards";
import { LoadingSkeleton } from "@/components/ui";
import ErrorState from "@/components/ui/ErrorState";
import { getPublicJobs, publicJobQueryKeys } from "@/services/jobs.service";

import SectionHeader from "./SectionHeader";

export default function LatestJobs() {
  const latestJobsQuery = useQuery({
    queryKey: publicJobQueryKeys.list({ limit: 3, sort: "-createdAt" }),
    queryFn: () => getPublicJobs({ limit: 3, sort: "-createdAt" }),
  });
  const jobResults = latestJobsQuery.data?.homeJobs ?? [];

  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Latest jobs"
          title="New opportunities added recently"
          description="Stay close to the newest roles so you can apply while shortlists are still forming."
          action={
            <Link
              href="/jobs?sort=latest"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
            >
              See latest jobs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        {latestJobsQuery.isLoading ? <div className="mt-10"><LoadingSkeleton variant="card" /></div> : null}
        {latestJobsQuery.isError ? <ErrorState title="Unable to load latest jobs" onRetry={() => latestJobsQuery.refetch()} /> : null}
        {latestJobsQuery.isSuccess && jobResults.length === 0 ? <p className="mt-10 text-sm text-muted">No recent jobs are available right now.</p> : null}
        {jobResults.length > 0 ? <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {jobResults.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div> : null}
      </div>
    </section>
  );
}
