"use client";

import { Download, FileText } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { ApplicantDetails } from "@/types/application.types";

type ResumePreviewCardProps = {
  application: ApplicantDetails;
};

export default function ResumePreviewCard({ application }: ResumePreviewCardProps) {
  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Resume Preview</h2>
            <p className="mt-1 text-sm text-muted">
              {application.resumeFileName ?? "Candidate resume"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Download className="size-4" aria-hidden="true" />}
            disabled={!application.resumeUrl}
            onClick={() => {
              if (application.resumeUrl) {
                window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            Download PDF
          </Button>
        </div>
      }
      contentClassName="p-0"
    >
      {application.resumeUrl ? (
        <div className="min-h-96 bg-slate-50 p-4 dark:bg-slate-900">
          <iframe
            title={`${application.applicantName} resume preview`}
            src={application.resumeUrl}
            className="h-96 w-full rounded-md border border-slate-200 bg-white dark:border-slate-700"
          />
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center bg-slate-50 px-6 py-12 text-center dark:bg-slate-900">
          <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <FileText className="size-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">No resume uploaded</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            This applicant has not attached a resume to the application yet.
          </p>
        </div>
      )}
    </Card>
  );
}
