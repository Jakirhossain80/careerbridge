import Link from "next/link";
import { Download, Eye, FileText } from "lucide-react";

import { ProfileSectionEmptyState } from "@/components/empty-states";
import { Badge, Button, Card } from "@/components/ui";
import type { JobSeekerResumeSummary } from "@/types/job-seeker-profile.types";

type ProfileResumeCardProps = {
  resume?: JobSeekerResumeSummary;
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

export default function ProfileResumeCard({ resume }: ProfileResumeCardProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Resume / CV</h2>
          <p className="mt-1 text-sm text-muted">Default resume for applications.</p>
        </div>
      }
    >
      {resume ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold text-foreground">
                  {resume.fileName}
                </p>
                <Badge variant={resume.isDefault ? "success" : "neutral"}>
                  {resume.isDefault ? "Default" : "Uploaded"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Uploaded {formatDate(resume.uploadedAt)}
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <a href={resume.fileUrl} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<Eye className="size-4" aria-hidden="true" />}
              >
                View Resume
              </Button>
            </a>
            <a href={resume.fileUrl} download>
              <Button
                className="w-full"
                leftIcon={<Download className="size-4" aria-hidden="true" />}
              >
                Download
              </Button>
            </a>
          </div>

          <Link href="/job-seeker/resume-manager" className="inline-flex text-sm font-semibold text-primary">
            Manage Resume
          </Link>
        </div>
      ) : (
        <ProfileSectionEmptyState
          title="No resume uploaded yet."
          actionLabel="Upload Resume"
          actionHref="/job-seeker/resume-manager"
        />
      )}
    </Card>
  );
}
