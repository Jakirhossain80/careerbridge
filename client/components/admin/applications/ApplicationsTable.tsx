"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ApplicationRowActions from "@/components/admin/applications/ApplicationRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type { AdminApplicationRecord } from "@/types/admin-application";
import type { AdminMeta } from "@/types/admin.types";

type ApplicationsTableProps = {
  applications: AdminApplicationRecord[];
  meta?: AdminMeta;
  loading?: boolean;
  dense?: boolean;
  selectedApplicationIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (applicationIds: string[]) => void;
  onUpdateStatus: (application: AdminApplicationRecord) => void;
};

function formatDate(value?: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getApplicant(application: AdminApplicationRecord) {
  return typeof application.applicantId === "object" && application.applicantId
    ? application.applicantId
    : undefined;
}

function getEmployer(application: AdminApplicationRecord) {
  return typeof application.employerId === "object" && application.employerId
    ? application.employerId
    : undefined;
}

function getJob(application: AdminApplicationRecord) {
  return typeof application.jobId === "object" && application.jobId
    ? application.jobId
    : undefined;
}

function getCompany(application: AdminApplicationRecord) {
  if (typeof application.companyId === "object" && application.companyId) {
    return application.companyId;
  }

  const job = getJob(application);
  if (typeof job?.companyId === "object") return job.companyId;
  return undefined;
}

function getApplicantName(application: AdminApplicationRecord) {
  return application.applicantName ?? getApplicant(application)?.name ?? "Applicant";
}

function getApplicantEmail(application: AdminApplicationRecord) {
  return application.applicantEmail ?? getApplicant(application)?.email ?? "No email";
}

function getJobTitle(application: AdminApplicationRecord) {
  return getJob(application)?.title ?? "Job not available";
}

function getCompanyName(application: AdminApplicationRecord) {
  const company = getCompany(application);
  return (
    getJob(application)?.companyName ??
    company?.companyName ??
    company?.name ??
    "Company not set"
  );
}

function getCompanyLogo(application: AdminApplicationRecord) {
  const company = getCompany(application);
  return company?.logo ?? company?.logoUrl;
}

function getEmployerName(application: AdminApplicationRecord) {
  return getEmployer(application)?.name ?? getEmployer(application)?.email ?? "Not assigned";
}

function getAvatar(application: AdminApplicationRecord) {
  const applicant = getApplicant(application);
  return application.applicantAvatar ?? applicant?.avatar ?? applicant?.photoURL;
}

function getInitials(value?: string) {
  const source = value?.trim() || "User";
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "US";
}

function getResumeStatus(application: AdminApplicationRecord) {
  if (application.resumeStatus) return application.resumeStatus;
  return application.resume || application.resumeUrl ? "uploaded" : "missing";
}

function getInterviewStatus(application: AdminApplicationRecord) {
  if (application.interviewStatus) return application.interviewStatus;
  return application.interviewScheduledAt ? "scheduled" : "not_scheduled";
}

export default function ApplicationsTable({
  applications,
  meta,
  loading = false,
  dense = false,
  selectedApplicationIds,
  onPageChange,
  onSelectionChange,
  onUpdateStatus,
}: ApplicationsTableProps) {
  const selectableIds = applications.map((application) => application._id);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedApplicationIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(
        selectedApplicationIds.filter((id) => !selectableIds.includes(id)),
      );
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedApplicationIds, ...selectableIds])));
  }

  function toggleApplication(applicationId: string) {
    if (selectedApplicationIds.includes(applicationId)) {
      onSelectionChange(selectedApplicationIds.filter((id) => id !== applicationId));
      return;
    }

    onSelectionChange([...selectedApplicationIds, applicationId]);
  }

  const columns: Array<TableColumn<AdminApplicationRecord>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible applications"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (application) => (
        <input
          type="checkbox"
          checked={selectedApplicationIds.includes(application._id)}
          onChange={() => toggleApplication(application._id)}
          aria-label={`Select ${getApplicantName(application)}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "applicant",
      header: "Applicant",
      render: (application) => {
        const name = getApplicantName(application);
        const avatar = getAvatar(application);

        return (
          <div className={`flex min-w-72 items-center gap-3 ${dense ? "py-0" : ""}`}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-10 rounded-full object-cover" />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary">
                {getInitials(name)}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/admin/applications/${application._id}`}
                className="font-semibold text-slate-950 hover:text-primary"
              >
                {name}
              </Link>
              <p className="mt-0.5 max-w-64 truncate text-xs text-muted">
                {getApplicantEmail(application)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "job",
      header: "Job",
      render: (application) => (
        <div className="min-w-72">
          <p className="font-medium text-slate-900">{getJobTitle(application)}</p>
          <p className="mt-1 max-w-64 truncate text-xs text-muted">
            Employer: {getEmployerName(application)}
          </p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (application) => {
        const companyName = getCompanyName(application);
        const logo = getCompanyLogo(application);

        return (
          <div className="flex min-w-64 items-center gap-3">
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
            <p className="font-medium text-slate-900">{companyName}</p>
          </div>
        );
      },
    },
    {
      key: "applied",
      header: "Applied",
      render: (application) => formatDate(application.createdAt),
    },
    {
      key: "match",
      header: "Match",
      render: (application) => {
        const score = application.matchScore;
        if (score === undefined) return "Not scored";

        return (
          <div className="min-w-32">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Score</span>
              <span className="text-xs font-semibold text-slate-900">{score}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (application) => <AdminStatusBadge status={application.status} />,
    },
    {
      key: "resume",
      header: "Resume",
      render: (application) => <AdminStatusBadge status={getResumeStatus(application)} />,
    },
    {
      key: "interview",
      header: "Interview",
      render: (application) => (
        <AdminStatusBadge status={getInterviewStatus(application)} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (application) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/applications/${application._id}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${getApplicantName(application)} application`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <ApplicationRowActions
            application={application}
            onUpdateStatus={onUpdateStatus}
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
      data={applications}
      loading={loading}
      emptyMessage="No applications found. Try adjusting your filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(application) => application._id}
    />
  );
}
