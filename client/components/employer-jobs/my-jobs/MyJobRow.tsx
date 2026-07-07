"use client";

import Link from "next/link";
import { Archive, Eye, FilePenLine, MapPin } from "lucide-react";

import type { ViewMode } from "@/components/employer-jobs/my-jobs/MyPostedJobsPage";
import { normalizeCurrencyCode } from "@/constants/currency-options";
import { Badge } from "@/components/ui";
import type {
  EmployerJobVisibility,
  EmployerPostedJob,
  EmployerPostedJobStatus,
} from "@/types/employer-job";

type MyJobRowProps = {
  job: EmployerPostedJob;
  viewMode: ViewMode;
  onArchive: (jobId: string) => void;
  onVisibilityChange: (jobId: string, visibility: EmployerJobVisibility) => void;
};

const statusVariant: Record<
  EmployerPostedJobStatus,
  "success" | "warning" | "danger" | "neutral"
> = {
  active: "success",
  inactive: "warning",
  draft: "neutral",
  pending: "warning",
  published: "success",
  closed: "danger",
  archived: "neutral",
  rejected: "danger",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not posted";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSalary(job: EmployerPostedJob) {
  const formatter = new Intl.NumberFormat("en", {
    currency: normalizeCurrencyCode(job.currency),
    maximumFractionDigits: 0,
    style: "currency",
  });

  return `${formatter.format(job.salaryMin)}-${formatter.format(job.salaryMax)}`;
}

function VisibilityToggle({
  job,
  onVisibilityChange,
}: {
  job: EmployerPostedJob;
  onVisibilityChange: (jobId: string, visibility: EmployerJobVisibility) => void;
}) {
  const isPublic = job.visibility === "public";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPublic}
      aria-label={`Set ${job.title} visibility`}
      className={`inline-flex h-7 w-12 items-center rounded-full p-1 transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
        isPublic ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      }`}
      onClick={() =>
        onVisibilityChange(job.id, isPublic ? "private" : "public")
      }
    >
      <span
        className={`size-5 rounded-full bg-white shadow-sm transition ${
          isPublic ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function JobActions({
  job,
  onArchive,
}: {
  job: EmployerPostedJob;
  onArchive: (jobId: string) => void;
}) {
  const editLabel = job.status === "draft" ? "Continue Editing" : "Edit";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/jobs/${job.id}`}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-primary dark:border-slate-700"
      >
        <Eye className="size-3.5" aria-hidden="true" />
        View
      </Link>
      <Link
        href={`/employer/jobs/${job.id}/edit`}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-primary dark:border-slate-700"
      >
        <FilePenLine className="size-3.5" aria-hidden="true" />
        {editLabel}
      </Link>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        onClick={() => onArchive(job.id)}
      >
        <Archive className="size-3.5" aria-hidden="true" />
        Archive
      </button>
    </div>
  );
}

export default function MyJobRow({
  job,
  viewMode,
  onArchive,
  onVisibilityChange,
}: MyJobRowProps) {
  const statusLabel = job.status.charAt(0).toUpperCase() + job.status.slice(1);

  if (viewMode === "grid") {
    return (
      <article className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{job.category}</p>
          </div>
          <Badge variant={statusVariant[job.status]}>{statusLabel}</Badge>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4" aria-hidden="true" />
          {job.location} · {job.jobType} · {job.workMode}
        </p>
        <p className="mt-2 text-sm font-semibold text-foreground">
          {formatSalary(job)}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-semibold text-foreground">{job.applicantsCount}</p>
            <p className="text-xs text-muted">Applicants</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{job.newApplicantsCount}</p>
            <p className="text-xs text-muted">New</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{job.viewsCount}</p>
            <p className="text-xs text-muted">Views</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm text-muted">{formatDate(job.postedDate)}</span>
          <VisibilityToggle job={job} onVisibilityChange={onVisibilityChange} />
        </div>
        <div className="mt-4">
          <JobActions job={job} onArchive={onArchive} />
        </div>
      </article>
    );
  }

  return (
    <tr className="transition hover:bg-blue-50/50 dark:hover:bg-slate-800">
      <th scope="row" className="min-w-72 px-5 py-4 text-left">
        <div>
          <p className="text-sm font-semibold text-foreground">{job.title}</p>
          <p className="mt-1 text-xs text-muted">
            {job.category} · {job.location} · {job.jobType}
          </p>
          <p className="mt-1 text-xs font-medium text-foreground">
            {formatSalary(job)}
          </p>
        </div>
      </th>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
        <span className="font-semibold text-foreground">
          {job.applicantsCount}
        </span>
        {job.newApplicantsCount > 0 ? (
          <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-primary">
            +{job.newApplicantsCount} new
          </span>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
        {formatDate(job.postedDate)}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm">
        <Badge variant={statusVariant[job.status]}>{statusLabel}</Badge>
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm">
        <div className="flex items-center gap-3">
          <VisibilityToggle job={job} onVisibilityChange={onVisibilityChange} />
          <span className="text-muted">
            {job.visibility === "public" ? "Public" : "Private"}
          </span>
        </div>
      </td>
      <td className="min-w-64 px-5 py-4">
        <JobActions job={job} onArchive={onArchive} />
      </td>
    </tr>
  );
}
