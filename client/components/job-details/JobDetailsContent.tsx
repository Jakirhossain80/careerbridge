"use client";

import { useQuery } from "@tanstack/react-query";

import ApplicationTipsCard from "@/components/job-details/ApplicationTipsCard";
import ApplyPanel from "@/components/job-details/ApplyPanel";
import CompanyProfileCard from "@/components/job-details/CompanyProfileCard";
import JobDescription from "@/components/job-details/JobDescription";
import JobDetailsHeader from "@/components/job-details/JobDetailsHeader";
import JobSummaryCards from "@/components/job-details/JobSummaryCards";
import MobileApplyBar from "@/components/job-details/MobileApplyBar";
import SimilarJobs from "@/components/job-details/SimilarJobs";
import { EmptyState, LoadingSkeleton } from "@/components/ui";
import {
  getPublicJobDetails,
  publicJobQueryKeys,
} from "@/services/jobs.service";

type JobDetailsContentProps = {
  idOrSlug: string;
};

function JobDetailsLoading() {
  return (
    <main className="bg-background px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <LoadingSkeleton variant="card" />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    </main>
  );
}

export default function JobDetailsContent({ idOrSlug }: JobDetailsContentProps) {
  const jobDetailsQuery = useQuery({
    queryKey: publicJobQueryKeys.detail(idOrSlug),
    queryFn: () => getPublicJobDetails(idOrSlug),
  });

  if (jobDetailsQuery.isLoading) {
    return <JobDetailsLoading />;
  }

  if (jobDetailsQuery.isError || !jobDetailsQuery.data) {
    return (
      <main className="bg-background px-6 py-12">
        <div className="mx-auto w-full max-w-3xl">
          <EmptyState
            title="Job not found"
            description="This job is unavailable or no longer accepting applications."
            actionLabel="Browse jobs"
            actionHref="/jobs"
          />
        </div>
      </main>
    );
  }

  const job = jobDetailsQuery.data;

  return (
    <>
      <main className="bg-background pb-20 lg:pb-0">
        <JobDetailsHeader job={job} />

        <section className="px-6 pb-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
            <div className="grid gap-6">
              <JobSummaryCards items={job.summaryCards} />
              <JobDescription job={job} />
              <CompanyProfileCard job={job} />
              <ApplicationTipsCard />
              <SimilarJobs jobs={job.similarJobs} />
            </div>

            <ApplyPanel job={job} />
          </div>
        </section>
      </main>
      <MobileApplyBar job={job} />
    </>
  );
}
