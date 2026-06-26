"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import PendingJobRiskScore from "@/components/admin/jobs/pending/PendingJobRiskScore";
import PendingJobRowActions from "@/components/admin/jobs/pending/PendingJobRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type {
  AdminJob,
  AdminJobApprovalStatus,
  AdminJobStatus,
} from "@/types/admin-job.types";
import type { AdminMeta } from "@/types/admin.types";

type PendingJobsTableProps = {
  jobs: AdminJob[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedJobIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (jobIds: string[]) => void;
  onChangeStatus: (job: AdminJob, status: AdminJobStatus) => void;
  onChangeApproval: (job: AdminJob, status: AdminJobApprovalStatus) => void;
  onRequestChanges: (job: AdminJob) => void;
};

function formatDate(value?: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatEnum(value?: string) {
  return value ? value.replace(/_/g, " ") : "Not set";
}

function getCompany(job: AdminJob) {
  return typeof job.companyId === "object" && job.companyId
    ? job.companyId
    : undefined;
}

function getEmployer(job: AdminJob) {
  return typeof job.employerId === "object" && job.employerId
    ? job.employerId
    : undefined;
}

function getCompanyName(job: AdminJob) {
  const company = getCompany(job);
  return job.companyName ?? company?.companyName ?? company?.name ?? "Company not set";
}

function getCompanyLogo(job: AdminJob) {
  const company = getCompany(job);
  return company?.logo ?? company?.logoUrl;
}

function getEmployerName(job: AdminJob) {
  return getEmployer(job)?.name ?? job.employerEmail ?? "Not assigned";
}

function getInitials(value?: string) {
  const source = value?.trim() || "Job";
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "JB";
}

function getSalary(job: AdminJob) {
  const min = job.salaryMin ?? job.salary?.min;
  const max = job.salaryMax ?? job.salary?.max;
  const currency = job.currency ?? job.salary?.currency ?? "USD";

  if (!min && !max) return job.salary?.negotiable ? "Negotiable" : "Not disclosed";
  if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  if (min) return `From ${currency} ${min.toLocaleString()}`;
  return `Up to ${currency} ${max?.toLocaleString()}`;
}

function getApprovalStatus(job: AdminJob): AdminJobApprovalStatus {
  if (job.approvalStatus) return job.approvalStatus;
  if (job.status === "rejected") return "rejected";
  return "pending_review";
}

export default function PendingJobsTable({
  jobs,
  meta,
  loading = false,
  selectedJobIds,
  onPageChange,
  onSelectionChange,
  onChangeStatus,
  onChangeApproval,
  onRequestChanges,
}: PendingJobsTableProps) {
  const selectableIds = jobs.map((job) => job._id);
  const allVisibleSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedJobIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(selectedJobIds.filter((id) => !selectableIds.includes(id)));
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedJobIds, ...selectableIds])));
  }

  function toggleJob(jobId: string) {
    if (selectedJobIds.includes(jobId)) {
      onSelectionChange(selectedJobIds.filter((id) => id !== jobId));
      return;
    }

    onSelectionChange([...selectedJobIds, jobId]);
  }

  const columns: Array<TableColumn<AdminJob>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible pending jobs"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (job) => (
        <input
          type="checkbox"
          checked={selectedJobIds.includes(job._id)}
          onChange={() => toggleJob(job._id)}
          aria-label={`Select ${job.title}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "job",
      header: "Job",
      render: (job) => (
        <div className="min-w-80">
          <Link
            href={`/admin/jobs/${job._id}`}
            className="font-semibold text-slate-950 hover:text-primary"
          >
            {job.title}
          </Link>
          <p className="mt-0.5 max-w-72 truncate text-xs text-slate-500">
            {job.slug ? `/${job.slug}` : `ID: ${job._id}`}
          </p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (job) => {
        const companyName = getCompanyName(job);
        const logo = getCompanyLogo(job);

        return (
          <div className="flex min-w-72 items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="size-10 rounded-md border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                {getInitials(companyName)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-slate-900">{companyName}</p>
              <p className="mt-1 max-w-56 truncate text-xs text-muted">
                {getEmployerName(job)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Category",
      render: (job) => (
        <div className="min-w-36">
          <p>{job.category ?? job.industry ?? "Not set"}</p>
          <p className="mt-1 text-xs capitalize text-muted">
            {formatEnum(job.experienceLevel)}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type / Mode",
      render: (job) => (
        <div className="min-w-36 capitalize">
          <p>{formatEnum(job.jobType)}</p>
          <p className="mt-1 text-xs text-muted">
            {formatEnum(job.workMode ?? job.workplaceType)}
          </p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (job) => <span className="block min-w-44">{job.location ?? "Not set"}</span>,
    },
    {
      key: "salary",
      header: "Salary",
      render: (job) => <span className="block min-w-48">{getSalary(job)}</span>,
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (job) => formatDate(job.applicationDeadline ?? job.deadline),
    },
    {
      key: "approval",
      header: "Approval",
      render: (job) => <AdminStatusBadge status={getApprovalStatus(job)} />,
    },
    {
      key: "status",
      header: "Status",
      render: (job) => <AdminStatusBadge status={job.status} />,
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (job) => formatDate(job.submittedAt ?? job.createdAt),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (job) => formatDate(job.createdAt),
    },
    {
      key: "risk",
      header: "Risk Score",
      render: (job) => (
        <PendingJobRiskScore riskScore={job.riskScore} riskLevel={job.riskLevel} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (job) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/jobs/${job._id}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${job.title}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <PendingJobRowActions
            job={job}
            onChangeStatus={onChangeStatus}
            onChangeApproval={onChangeApproval}
            onRequestChanges={onRequestChanges}
          />
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={jobs}
      loading={loading}
      emptyMessage="No pending jobs found. Try adjusting your queue or filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(job) => job._id}
    />
  );
}
