"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import ApplyJobModal from "@/components/job-seeker/ApplyJobModal";
import JobCard from "@/components/cards/JobCard";
import { Button } from "@/components/ui";
import type { RecommendedJob } from "@/types/recommended-job.types";

type RecommendedJobsListProps = {
  jobs: RecommendedJob[];
  savingJobId?: string;
  onToggleSave: (job: RecommendedJob) => void;
  onApplicationSubmitted: () => void;
};

function formatSalary(job: RecommendedJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return undefined;
  }

  const formatter = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: job.currency ?? "USD",
  });

  if (job.salaryMin && job.salaryMax) {
    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  }

  return formatter.format(job.salaryMin ?? job.salaryMax ?? 0);
}

function formatDate(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatWorkMode(value?: string) {
  if (!value) {
    return "Flexible";
  }

  return value === "onsite"
    ? "On-site"
    : `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export default function RecommendedJobsList({
  jobs,
  savingJobId,
  onToggleSave,
  onApplicationSubmitted,
}: RecommendedJobsListProps) {
  return (
    <section aria-labelledby="recommended-jobs-results-heading">
      <h2 id="recommended-jobs-results-heading" className="sr-only">
        Recommended job results
      </h2>
      <div className="grid gap-5 xl:grid-cols-2">
        {jobs.map((job) => {
          const href = `/jobs/${job.slug ?? job._id}`;

          return (
            <JobCard
              key={job._id}
              id={job._id}
              title={job.title}
              companyName={job.companyName}
              companyLogo={job.companyLogo}
              location={job.location ?? "Remote"}
              jobType={job.employmentType ?? job.jobType ?? "Full-time"}
              workMode={formatWorkMode(job.workMode)}
              salary={formatSalary(job)}
              skills={job.skills}
              description={job.description}
              postedAt={formatDate(job.postedAt ?? job.createdAt)}
              deadline={formatDate(job.applicationDeadline)}
              href={href}
              matchScore={job.matchScore}
              matchReasons={job.matchReasons}
              showSaveButton
              saved={Boolean(job.isSaved)}
              saveDisabled={savingJobId === job._id}
              onSave={() => onToggleSave(job)}
              className="h-full"
              primaryAction={
                <>
                  <Link href={href}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<ExternalLink className="size-4" aria-hidden="true" />}
                    >
                      View Details
                    </Button>
                  </Link>
                  {job.hasApplied ? (
                    <Button type="button" size="sm" disabled>
                      Applied
                    </Button>
                  ) : (
                    <ApplyJobModal
                      jobId={job._id}
                      jobTitle={job.title}
                      triggerLabel="Quick Apply"
                      triggerClassName="h-9 px-3 text-sm"
                      onApplicationSubmitted={onApplicationSubmitted}
                    />
                  )}
                </>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
