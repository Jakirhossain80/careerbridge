"use client";

import Link from "next/link";
import { Eye, Star } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import JobRowActions from "@/components/admin/jobs/JobRowActions";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type {
  AdminJob,
  AdminJobApprovalStatus,
  AdminJobStatus,
} from "@/types/admin-job.types";
import type { AdminMeta } from "@/types/admin.types";

type JobsTableProps = {
  jobs: AdminJob[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedJobIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (jobIds: string[]) => void;
  onChangeStatus: (job: AdminJob, status: AdminJobStatus | "delete") => void;
  onChangeApproval: (job: AdminJob, status: AdminJobApprovalStatus) => void;
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

function getInitials(value?: string) {
  const source = value?.trim() || "Job";
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "JB";
}

function getEmployerName(job: AdminJob) {
  return getEmployer(job)?.name ?? job.employerEmail ?? "Not assigned";
}

function getApplicationCount(job: AdminJob) {
  return job.applicationCount ?? job.applicationsCount ?? 0;
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

function getDeadline(job: AdminJob) {
  return job.applicationDeadline ?? job.deadline;
}

function getApprovalStatus(job: AdminJob): AdminJobApprovalStatus {
  if (job.approvalStatus) return job.approvalStatus;
  if (job.status === "rejected") return "rejected";
  if (job.status === "pending" || job.status === "draft") return "pending_review";
  return "approved";
}

export default function JobsTable({
  jobs,
  meta,
  loading = false,
  selectedJobIds,
  onPageChange,
  onSelectionChange,
  onChangeStatus,
  onChangeApproval,
}: JobsTableProps) {
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
          aria-label="Select all visible jobs"
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
      render: (job) => formatDate(getDeadline(job)),
    },
    {
      key: "applications",
      header: "Applications",
      render: (job) => (
        <Link
          href={`/admin/applications?search=${encodeURIComponent(job.title)}`}
          className="font-semibold text-primary hover:underline"
        >
          {getApplicationCount(job).toLocaleString()}
        </Link>
      ),
    },
    {
      key: "visibility",
      header: "Visibility",
      render: (job) => (
        <div className="flex min-w-28 items-center gap-2">
          <AdminStatusBadge status={job.visibility ?? "public"} />
          {job.featured ?? job.isFeatured ? (
            <Badge variant="primary" title="Featured job" className="gap-1">
              <Star className="size-3" aria-hidden="true" />
              Featured
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (job) => <AdminStatusBadge status={job.status} />,
    },
    {
      key: "approval",
      header: "Approval",
      render: (job) => <AdminStatusBadge status={getApprovalStatus(job)} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (job) => formatDate(job.createdAt),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (job) => formatDate(job.updatedAt),
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
          <JobRowActions
            job={job}
            onChangeStatus={onChangeStatus}
            onChangeApproval={onChangeApproval}
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
      emptyMessage="No jobs found. Try adjusting your search or filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(job) => job._id}
    />
  );
}
