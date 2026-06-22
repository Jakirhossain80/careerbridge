"use client";

import MyJobRow from "@/components/employer-jobs/my-jobs/MyJobRow";
import type { ViewMode } from "@/components/employer-jobs/my-jobs/MyPostedJobsPage";
import type { EmployerJobVisibility, EmployerPostedJob } from "@/types/employer-job";

type MyJobsTableProps = {
  jobs: EmployerPostedJob[];
  viewMode: ViewMode;
  onArchive: (jobId: string) => void;
  onVisibilityChange: (jobId: string, visibility: EmployerJobVisibility) => void;
};

export default function MyJobsTable({
  jobs,
  viewMode,
  onArchive,
  onVisibilityChange,
}: MyJobsTableProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <MyJobRow
            key={job.id}
            job={job}
            viewMode="grid"
            onArchive={onArchive}
            onVisibilityChange={onVisibilityChange}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {[
              "Job Title & Category",
              "Applicants",
              "Posted Date",
              "Status",
              "Visibility",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {jobs.map((job) => (
            <MyJobRow
              key={job.id}
              job={job}
              viewMode="list"
              onArchive={onArchive}
              onVisibilityChange={onVisibilityChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
