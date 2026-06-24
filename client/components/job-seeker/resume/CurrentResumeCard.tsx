"use client";

import { Download, Eye, FileText, RefreshCw, Star, Trash2 } from "lucide-react";

import { Badge, Button, Card, EmptyState } from "@/components/ui";
import type { ResumeFile, ResumeStatus } from "@/types/resume.types";

type CurrentResumeCardProps = {
  resume?: ResumeFile;
  isReplacing?: boolean;
  isDeleting?: boolean;
  onView: (resume: ResumeFile) => void;
  onDownload: (resume: ResumeFile) => void;
  onReplace: (resume: ResumeFile) => void;
  onDelete: (resume: ResumeFile) => void;
};

const statusLabels: Record<ResumeStatus, string> = {
  uploaded: "Uploaded",
  missing: "Missing",
  processing: "Processing",
  active: "Active",
};

const statusVariants: Record<ResumeStatus, "primary" | "success" | "warning" | "neutral"> = {
  uploaded: "primary",
  missing: "neutral",
  processing: "warning",
  active: "success",
};

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSize(bytes: number) {
  if (!bytes) {
    return "Not available";
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function CurrentResumeCard({
  resume,
  isReplacing = false,
  isDeleting = false,
  onView,
  onDownload,
  onReplace,
  onDelete,
}: CurrentResumeCardProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Current resume
          </h2>
          <p className="mt-1 text-sm text-muted">
            Active file used by profile and application flows.
          </p>
        </div>
      }
    >
      {!resume ? (
        <EmptyState
          title="No resume uploaded yet."
          description="Upload a PDF, DOC, or DOCX resume to start applying faster."
          className="border-slate-200 shadow-none"
        />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                <FileText className="size-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-foreground">
                    {resume.fileName}
                  </h3>
                  <Badge variant={statusVariants[resume.status]}>
                    {statusLabels[resume.status]}
                  </Badge>
                  {resume.isDefault ? (
                    <Badge variant="success">
                      <Star className="mr-1 size-3" aria-hidden="true" />
                      Default
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {resume.fileType.toUpperCase()} file
                  {resume.version ? ` · Version ${resume.version}` : ""}
                </p>
              </div>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase text-muted">
                Upload date
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatDate(resume.uploadedAt)}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase text-muted">
                Last updated
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatDate(resume.updatedAt ?? resume.uploadedAt)}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase text-muted">
                Resume size
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatSize(resume.fileSize)}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase text-muted">
                Resume type
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {resume.fileType.toUpperCase()}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => onView(resume)}
              leftIcon={<Eye className="size-4" aria-hidden="true" />}
            >
              View
            </Button>
            <Button
              onClick={() => onDownload(resume)}
              leftIcon={<Download className="size-4" aria-hidden="true" />}
            >
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => onReplace(resume)}
              isLoading={isReplacing}
              leftIcon={<RefreshCw className="size-4" aria-hidden="true" />}
            >
              Replace
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(resume)}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="size-4" aria-hidden="true" />}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
