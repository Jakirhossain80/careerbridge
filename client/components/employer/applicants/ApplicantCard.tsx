"use client";

import { CalendarDays, Download, Eye, Mail, RotateCcw } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type {
  ApplicationStatus,
  EmployerApplication,
} from "@/types/application.types";

type ApplicantCardProps = {
  application: EmployerApplication;
  isUpdating?: boolean;
  onViewProfile: (application: EmployerApplication) => void;
  onDownloadResume: (application: EmployerApplication) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
};

const statusLabels: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected",
};

const statusBadgeClasses: Record<ApplicationStatus, string> = {
  applied: "border-slate-200 bg-slate-100 text-slate-700",
  under_review: "border-blue-200 bg-blue-50 text-blue-700",
  shortlisted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  interview: "border-indigo-200 bg-indigo-50 text-indigo-700",
  offered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  hired: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ApplicantCard({
  application,
  isUpdating = false,
  onViewProfile,
  onDownloadResume,
  onStatusChange,
}: ApplicantCardProps) {
  const canShortlist = application.status !== "shortlisted";
  const canReject = application.status !== "rejected";

  return (
    <Card className="shadow-sm" contentClassName="p-4 sm:p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-primary">
            {application.applicantAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={application.applicantAvatar}
                alt=""
                className="size-full rounded-full object-cover"
              />
            ) : (
              getInitials(application.applicantName)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {application.applicantName}
              </h3>
              <Badge className={statusBadgeClasses[application.status]}>
                {statusLabels[application.status]}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-4" aria-hidden="true" />
                {application.applicantEmail}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                Applied {formatDate(application.appliedAt)}
              </span>
            </div>

            <p className="mt-2 text-sm font-medium text-foreground">
              {application.jobTitle}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(application.skills ?? []).slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[auto_1fr] xl:min-w-96 xl:grid-cols-[auto_auto] xl:items-center">
          <div className="rounded-lg border border-slate-200 bg-background px-4 py-3 text-center dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Match
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {application.matchScore ?? 0}%
            </p>
          </div>

          <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Eye className="size-4" aria-hidden="true" />}
              onClick={() => onViewProfile(application)}
            >
              View Profile
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Download className="size-4" aria-hidden="true" />}
              onClick={() => onDownloadResume(application)}
              disabled={!application.resumeUrl}
            >
              Resume
            </Button>
            {application.status === "rejected" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
                isLoading={isUpdating}
                onClick={() => onStatusChange(application._id, "under_review")}
              >
                Undo Rejection
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={isUpdating && canShortlist}
                  disabled={!canShortlist}
                  onClick={() => onStatusChange(application._id, "shortlisted")}
                >
                  Shortlist
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  isLoading={isUpdating && canReject}
                  disabled={!canReject}
                  onClick={() => onStatusChange(application._id, "rejected")}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { statusLabels };
