import { Badge, Table } from "@/components/ui";
import type { TableColumn } from "@/components/ui";
import type { TopPerformingJob } from "@/types/analytics.types";

type TopPerformingJobsTableProps = {
  jobs: TopPerformingJob[];
};

const statusVariant = {
  active: "success",
  closed: "neutral",
  draft: "warning",
  archived: "danger",
} as const;

function formatStatus(status: TopPerformingJob["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const columns: Array<TableColumn<TopPerformingJob>> = [
  {
    key: "title",
    header: "Job",
    render: (job) => (
      <div>
        <p className="font-semibold text-foreground">{job.title}</p>
        <p className="mt-1 text-xs text-muted">{job.jobId}</p>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    accessor: "category",
  },
  {
    key: "workMode",
    header: "Work mode",
    render: (job) => job.workMode ?? "Not set",
  },
  {
    key: "status",
    header: "Status",
    render: (job) => (
      <Badge variant={statusVariant[job.status]}>{formatStatus(job.status)}</Badge>
    ),
  },
  {
    key: "totalViews",
    header: "Views",
    render: (job) => job.totalViews.toLocaleString(),
  },
  {
    key: "applications",
    header: "Applications",
    render: (job) => job.applications.toLocaleString(),
  },
  {
    key: "conversionRate",
    header: "Conversion",
    render: (job) => `${job.conversionRate}%`,
  },
];

export default function TopPerformingJobsTable({
  jobs,
}: TopPerformingJobsTableProps) {
  return (
    <section aria-labelledby="top-performing-jobs-heading" className="space-y-4">
      <div>
        <h2
          id="top-performing-jobs-heading"
          className="text-lg font-semibold text-foreground"
        >
          Top Performing Jobs
        </h2>
        <p className="mt-1 text-sm text-muted">
          Job-level performance ranked by views, applications, and conversion.
        </p>
      </div>

      <Table
        columns={columns}
        data={jobs}
        getRowKey={(job) => job.jobId}
        emptyMessage="No matching job analytics found."
      />
    </section>
  );
}
