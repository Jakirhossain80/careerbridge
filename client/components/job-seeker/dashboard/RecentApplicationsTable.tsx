import Link from "next/link";

import { Card, Table, type TableColumn } from "@/components/ui";
import { ApplicationStatusBadge } from "@/components/job-seeker/status";
import type { JobSeekerRecentApplication } from "@/types/job-seeker-dashboard.types";

type RecentApplicationsTableProps = {
  applications: JobSeekerRecentApplication[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function RecentApplicationsTable({
  applications,
}: RecentApplicationsTableProps) {
  const columns: Array<TableColumn<JobSeekerRecentApplication>> = [
    {
      key: "job",
      header: "Job Title",
      render: (application) => (
        <div>
          <Link
            href={`/jobs/${application.jobId}`}
            className="font-semibold text-foreground transition hover:text-primary"
          >
            {application.jobTitle}
          </Link>
          <p className="mt-1 text-xs text-muted">{application.companyName}</p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      accessor: "companyName",
    },
    {
      key: "appliedAt",
      header: "Application Date",
      render: (application) => formatDate(application.appliedAt),
    },
    {
      key: "status",
      header: "Status",
      render: (application) => <ApplicationStatusBadge status={application.status} />,
    },
  ];

  return (
    <Card
      header={
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Recent Applications
            </h2>
            <p className="mt-1 text-sm text-muted">Latest roles you applied to</p>
          </div>
          <Link
            href="/profile/applications"
            className="text-sm font-semibold text-primary hover:text-blue-700"
          >
            View all
          </Link>
        </div>
      }
      contentClassName="p-0"
    >
      <Table
        columns={columns}
        data={applications}
        emptyMessage="No recent applications yet."
        getRowKey={(application) => application._id}
        className="rounded-none border-0 shadow-none"
      />
    </Card>
  );
}
