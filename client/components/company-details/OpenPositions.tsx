"use client";

import JobsEmptyState from "@/components/jobs/JobsEmptyState";
import JobsList from "@/components/jobs/JobsList";
import JobsLoadingSkeleton from "@/components/jobs/JobsLoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { usePublicJobs } from "@/hooks/usePublicJobs";
import type { CompanyDetails } from "@/lib/company-details-data";

type OpenPositionsProps = { company: CompanyDetails };

export default function OpenPositions({ company }: OpenPositionsProps) {
  const jobsQuery = usePublicJobs({ companyId: company.id, limit: 6, sort: "-createdAt" });
  const jobs = jobsQuery.data?.browseJobs ?? [];
  return <section aria-labelledby="open-positions-heading"><div className="mb-5"><p className="text-sm font-semibold uppercase tracking-wide text-primary">Open opportunities</p><h2 id="open-positions-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">Jobs at {company.name}</h2><p className="mt-2 text-sm text-muted">{jobsQuery.data?.meta.total ?? 0} current {(jobsQuery.data?.meta.total ?? 0) === 1 ? "position" : "positions"}.</p></div>{jobsQuery.isLoading ? <JobsLoadingSkeleton /> : null}{jobsQuery.isError ? <ErrorState title="Unable to load company jobs" onRetry={() => jobsQuery.refetch()} /> : null}{jobsQuery.isSuccess && jobs.length === 0 ? <JobsEmptyState /> : null}{jobs.length > 0 ? <JobsList jobs={jobs} view="list" /> : null}</section>;
}
