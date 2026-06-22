"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Download,
  Eye,
  MapPin,
  Star,
} from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type {
  ApplicationStatus,
  EmployerApplication,
} from "@/types/application.types";
import { applicationStatusLabels } from "@/types/application.types";

type ShortlistedApplicantCardProps = {
  application: EmployerApplication;
  detailsHref: string;
  isUpdating?: boolean;
  onDownloadResume: (application: EmployerApplication) => void;
  onScheduleInterview: (application: EmployerApplication) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSalary(min?: number, max?: number) {
  const formatter = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "USD",
  });

  if (typeof min === "number" && typeof max === "number") {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }

  if (typeof min === "number") {
    return `${formatter.format(min)}+`;
  }

  if (typeof max === "number") {
    return `Up to ${formatter.format(max)}`;
  }

  return "Not provided";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ShortlistedApplicantCard({
  application,
  detailsHref,
  isUpdating = false,
  onDownloadResume,
  onScheduleInterview,
  onStatusChange,
}: ShortlistedApplicantCardProps) {
  return (
    <Card className="relative shadow-sm" contentClassName="p-0">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" aria-hidden="true" />
      <div className="p-4 pl-6 sm:p-5 sm:pl-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-primary">
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
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {application.applicantName}
                </h3>
                <Badge variant="success">
                  {applicationStatusLabels[application.status]}
                </Badge>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  <Star className="size-3.5 fill-current" aria-hidden="true" />
                  {application.matchScore ?? 0}% match
                </span>
              </div>

              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-foreground">
                <BriefcaseBusiness className="size-4 text-primary" aria-hidden="true" />
                {application.jobTitle}
                {application.companyName ? (
                  <span className="font-medium text-muted">
                    at {application.companyName}
                  </span>
                ) : null}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(application.skills ?? []).slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                {application.summary ??
                  application.coverLetter ??
                  "Candidate summary is not available yet."}
              </p>

              <dl className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="font-semibold text-foreground">Location</dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden="true" />
                    {application.location ?? "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Applied</dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {formatDate(application.appliedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Experience</dt>
                  <dd className="mt-1">
                    {typeof application.experienceYears === "number"
                      ? `${application.experienceYears} years`
                      : "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Expected Salary</dt>
                  <dd className="mt-1">
                    {formatSalary(
                      application.expectedSalaryMin,
                      application.expectedSalaryMax,
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:max-w-80 xl:justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => onScheduleInterview(application)}
            >
              Schedule Interview
            </Button>
            <Link
              href={detailsHref}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
            >
              <Eye className="size-4" aria-hidden="true" />
              View Profile
            </Link>
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isUpdating}
              onClick={() => onStatusChange(application._id, "interview")}
            >
              Move to Interview
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isUpdating}
              onClick={() => onStatusChange(application._id, "offered")}
            >
              Move to Offered
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isUpdating}
              onClick={() => onStatusChange(application._id, "hired")}
            >
              Move to Hired
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isUpdating}
              onClick={() => onStatusChange(application._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
