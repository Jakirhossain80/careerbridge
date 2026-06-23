import Link from "next/link";

import JobCard from "@/components/cards/JobCard";
import { Card } from "@/components/ui";
import type { JobSeekerRecommendedJob } from "@/types/job-seeker-dashboard.types";

type RecommendedJobsCardProps = {
  jobs: JobSeekerRecommendedJob[];
};

function formatSalary(job: JobSeekerRecommendedJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return undefined;
  }

  const formatter = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "USD",
  });

  if (job.salaryMin && job.salaryMax) {
    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  }

  return formatter.format(job.salaryMin ?? job.salaryMax ?? 0);
}

export default function RecommendedJobsCard({ jobs }: RecommendedJobsCardProps) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Recommended Jobs
            </h2>
            <p className="mt-1 text-sm text-muted">
              Based on your profile and saved searches
            </p>
          </div>
          <Link
            href="/job-seeker/recommended-jobs"
            className="text-sm font-semibold text-primary hover:text-blue-700"
          >
            View all
          </Link>
        </div>
      }
    >
      {jobs.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              id={job._id}
              title={job.title}
              companyName={job.companyName}
              location={job.location ?? "Remote"}
              jobType={job.employmentType ?? "Full-time"}
              workMode={job.location?.toLowerCase().includes("remote") ? "Remote" : "Hybrid"}
              salary={formatSalary(job)}
              href={`/jobs/${job.slug ?? job._id}`}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            No recommended jobs available yet.
          </p>
          <Link
            href="/jobs"
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:text-blue-700"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </Card>
  );
}
