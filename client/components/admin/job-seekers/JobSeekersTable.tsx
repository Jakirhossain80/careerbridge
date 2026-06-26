"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import UserStatusBadge from "@/components/admin/UserStatusBadge";
import JobSeekerRowActions from "@/components/admin/job-seekers/JobSeekerRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type {
  AdminJobSeeker,
  AdminJobSeekerStatus,
} from "@/types/admin-job-seeker.types";
import type { AdminMeta } from "@/types/admin.types";

type JobSeekersTableProps = {
  jobSeekers: AdminJobSeeker[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedJobSeekerIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (jobSeekerIds: string[]) => void;
  onChangeStatus: (
    jobSeeker: AdminJobSeeker,
    status: AdminJobSeekerStatus | "unblock",
  ) => void;
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "JS";
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function JobSeekersTable({
  jobSeekers,
  meta,
  loading = false,
  selectedJobSeekerIds,
  onPageChange,
  onSelectionChange,
  onChangeStatus,
}: JobSeekersTableProps) {
  const selectableIds = jobSeekers.map((jobSeeker) => jobSeeker._id);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedJobSeekerIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(
        selectedJobSeekerIds.filter((id) => !selectableIds.includes(id)),
      );
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedJobSeekerIds, ...selectableIds])));
  }

  function toggleJobSeeker(jobSeekerId: string) {
    if (selectedJobSeekerIds.includes(jobSeekerId)) {
      onSelectionChange(selectedJobSeekerIds.filter((id) => id !== jobSeekerId));
      return;
    }

    onSelectionChange([...selectedJobSeekerIds, jobSeekerId]);
  }

  const columns: Array<TableColumn<AdminJobSeeker>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible job seekers"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (jobSeeker) => (
        <input
          type="checkbox"
          checked={selectedJobSeekerIds.includes(jobSeeker._id)}
          onChange={() => toggleJobSeeker(jobSeeker._id)}
          aria-label={`Select ${jobSeeker.name}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "jobSeeker",
      header: "Job Seeker",
      render: (jobSeeker) => (
        <div className="flex min-w-72 items-center gap-3">
          {jobSeeker.avatar || jobSeeker.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={jobSeeker.avatar ?? jobSeeker.photoURL}
              alt=""
              className="size-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-primary">
              {getInitials(jobSeeker.name)}
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={`/admin/users/${jobSeeker._id}`}
              className="font-semibold text-slate-950 hover:text-primary"
            >
              {jobSeeker.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted">{jobSeeker.email}</p>
            <p className="mt-0.5 max-w-72 truncate text-xs text-slate-500">
              {jobSeeker.professionalHeadline ?? "No headline added"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (jobSeeker) => (
        <div className="min-w-44">
          <p>{jobSeeker.phone ?? "No phone"}</p>
          <p className="mt-1 text-xs text-muted">
            {jobSeeker.location ?? "Location not set"}
          </p>
        </div>
      ),
    },
    {
      key: "profileCompletion",
      header: "Profile",
      render: (jobSeeker) => {
        const completion = formatPercent(jobSeeker.profileCompletion);

        return (
          <div className="min-w-36">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">
                {completion}%
              </span>
              <span className="text-xs text-muted">complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "resumeStatus",
      header: "Resume",
      render: (jobSeeker) => (
        <div className="min-w-32">
          <AdminStatusBadge status={jobSeeker.resumeStatus ?? "missing"} />
          {jobSeeker.resume?.fileName ? (
            <p className="mt-1 max-w-36 truncate text-xs text-muted">
              {jobSeeker.resume.fileName}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Account",
      render: (jobSeeker) => <UserStatusBadge status={jobSeeker.status} />,
    },
    {
      key: "applications",
      header: "Applications",
      render: (jobSeeker) => (
        <span className="font-semibold text-slate-900">
          {(jobSeeker.applicationsCount ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Registered",
      render: (jobSeeker) => formatDate(jobSeeker.createdAt),
    },
    {
      key: "lastActivityAt",
      header: "Last Activity",
      render: (jobSeeker) => formatDate(jobSeeker.lastActivityAt ?? jobSeeker.updatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (jobSeeker) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/users/${jobSeeker._id}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${jobSeeker.name}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <JobSeekerRowActions
            jobSeeker={jobSeeker}
            onChangeStatus={onChangeStatus}
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
      data={jobSeekers}
      loading={loading}
      emptyMessage="No job seekers found. Try adjusting your search or filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(jobSeeker) => jobSeeker._id}
    />
  );
}
