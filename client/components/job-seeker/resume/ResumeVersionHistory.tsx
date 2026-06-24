"use client";

import { RotateCcw } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { ResumeFile } from "@/types/resume.types";

type ResumeVersionHistoryProps = {
  resumes: ResumeFile[];
  onRestore: (resume: ResumeFile) => void;
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

export default function ResumeVersionHistory({
  resumes,
  onRestore,
}: ResumeVersionHistoryProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Version history
          </h2>
          <p className="mt-1 text-sm text-muted">
            Review previous uploads and active versions.
          </p>
        </div>
      }
    >
      {resumes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted">
          Resume versions will appear after your first upload.
        </p>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume, index) => (
            <div
              key={resume._id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {resume.fileName}
                  </p>
                  {resume.isDefault ? <Badge variant="success">Active</Badge> : null}
                </div>
                <p className="mt-1 text-xs text-muted">
                  Version {resume.version ?? resumes.length - index} · Uploaded{" "}
                  {formatDate(resume.uploadedAt)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={resume.isDefault}
                onClick={() => onRestore(resume)}
                leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
              >
                Restore
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
