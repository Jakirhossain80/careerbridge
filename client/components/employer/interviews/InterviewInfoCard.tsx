"use client";

import type { ReactNode } from "react";
import { CalendarDays, Clipboard, Link2, MapPin } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { InterviewDetails } from "@/types/interview.types";
import { interviewTypeLabels } from "@/types/interview.types";
import InterviewStatusBadge from "./InterviewStatusBadge";

type InterviewInfoCardProps = {
  interview: InterviewDetails;
  copiedMeetingLink: boolean;
  onCopyMeetingLink: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-foreground">{value ?? "Not provided"}</dd>
    </div>
  );
}

export default function InterviewInfoCard({
  interview,
  copiedMeetingLink,
  onCopyMeetingLink,
}: InterviewInfoCardProps) {
  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Interview Information
            </h2>
            <p className="mt-1 text-sm text-muted">
              Schedule, logistics, interviewer, and audit details.
            </p>
          </div>
          <InterviewStatusBadge status={interview.status} />
        </div>
      }
      contentClassName="space-y-5 p-5"
    >
      <dl className="grid gap-4 md:grid-cols-2">
        <DetailRow label="Interview ID" value={interview._id} />
        <DetailRow
          label="Interview Status"
          value={<InterviewStatusBadge status={interview.status} />}
        />
        <DetailRow
          label="Interview Type"
          value={interviewTypeLabels[interview.interviewType]}
        />
        <DetailRow
          label="Interview Date"
          value={
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-muted" aria-hidden="true" />
              {formatDate(interview.interviewDate)}
            </span>
          }
        />
        <DetailRow label="Interview Time" value={interview.interviewTime} />
        <DetailRow
          label="Interview Duration"
          value={interview.duration ? `${interview.duration} minutes` : undefined}
        />
        <DetailRow
          label="Interviewer Name"
          value={
            <span>
              {interview.interviewerName}
              {interview.interviewerTitle ? (
                <span className="block text-xs font-normal text-muted">
                  {interview.interviewerTitle}
                </span>
              ) : null}
            </span>
          }
        />
        <DetailRow
          label="Location"
          value={
            interview.location ? (
              <span className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
                {interview.location}
              </span>
            ) : undefined
          }
        />
        <DetailRow label="Created Date" value={formatDateTime(interview.createdAt)} />
        <DetailRow
          label="Last Updated Date"
          value={formatDateTime(interview.updatedAt)}
        />
      </dl>

      <section className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Meeting Link
            </h3>
            {interview.meetingLink ? (
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex min-w-0 items-center gap-2 text-sm font-medium text-primary hover:text-blue-700"
              >
                <Link2 className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{interview.meetingLink}</span>
              </a>
            ) : (
              <p className="mt-2 text-sm text-muted">Not provided</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Clipboard className="size-4" aria-hidden="true" />}
            disabled={!interview.meetingLink}
            onClick={onCopyMeetingLink}
          >
            {copiedMeetingLink ? "Copied" : "Copy Link"}
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Notes
        </h3>
        <p className="mt-2 text-sm leading-6 text-foreground">
          {interview.notes ?? "No interview notes added yet."}
        </p>
      </section>
    </Card>
  );
}
