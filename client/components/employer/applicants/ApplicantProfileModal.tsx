"use client";

import { Download } from "lucide-react";

import { Badge, Button, Modal } from "@/components/ui";
import type { EmployerApplication } from "@/types/application.types";
import { statusLabels } from "./ApplicantCard";

type ApplicantProfileModalProps = {
  application: EmployerApplication | null;
  open: boolean;
  onClose: () => void;
  onDownloadResume: (application: EmployerApplication) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function ApplicantProfileModal({
  application,
  open,
  onClose,
  onDownloadResume,
}: ApplicantProfileModalProps) {
  if (!application) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={application.applicantName}
      description={`${application.jobTitle} applicant`}
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            leftIcon={<Download className="size-4" aria-hidden="true" />}
            onClick={() => onDownloadResume(application)}
            disabled={!application.resumeUrl}
          >
            View Resume
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-background p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <div>
            <p className="text-sm text-muted">{application.applicantEmail}</p>
            <p className="mt-1 text-sm text-muted">
              Applied {formatDate(application.appliedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{application.matchScore ?? 0}% match</Badge>
            <Badge>{statusLabels[application.status]}</Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Experience
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {application.experienceYears ?? 0}+ years
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Job
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {application.jobTitle}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Skills
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(application.skills ?? []).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Cover letter
          </p>
          <p className="mt-2 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {application.coverLetter ??
              "No cover letter was included with this application."}
          </p>
        </div>
      </div>
    </Modal>
  );
}
