"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarPlus,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  UserRound,
} from "lucide-react";

import InterviewStatusBadge from "@/components/employer/interviews/InterviewStatusBadge";
import { Badge, Button, Card } from "@/components/ui";
import type { JobSeekerInterview } from "@/types/interview.types";
import { interviewTypeLabels } from "@/types/interview.types";

type JobSeekerInterviewCardProps = {
  interview: JobSeekerInterview;
  onJoinMeeting: (interview: JobSeekerInterview) => void;
  onViewMap: (interview: JobSeekerInterview) => void;
  onRequestReschedule: (interview: JobSeekerInterview) => void;
  onConfirmAttendance: (interview: JobSeekerInterview) => void;
  isConfirming?: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(start: string, end?: string) {
  return end ? `${start} - ${end}` : start;
}

function getCalendarUrl(interview: JobSeekerInterview) {
  const start = `${interview.interviewDate.replaceAll("-", "")}T${interview.interviewTime.replace(":", "")}00`;
  const endTime = interview.interviewEndTime ?? interview.interviewTime;
  const end = `${interview.interviewDate.replaceAll("-", "")}T${endTime.replace(":", "")}00`;
  const details = interview.meetingLink ?? interview.location ?? "";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${interview.jobTitle} interview with ${interview.companyName}`,
    dates: `${start}/${end}`,
    details,
    location: interview.location ?? interview.meetingLink ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getCompanyInitials(companyName: string) {
  return companyName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function JobSeekerInterviewCard({
  interview,
  onJoinMeeting,
  onViewMap,
  onRequestReschedule,
  onConfirmAttendance,
  isConfirming = false,
}: JobSeekerInterviewCardProps) {
  const canJoin = Boolean(interview.meetingLink);
  const canViewMap = interview.interviewType === "on_site" && Boolean(interview.location);
  const canConfirm = interview.status === "scheduled";
  const canRequestReschedule = !["completed", "cancelled", "no_show"].includes(
    interview.status,
  );
  const companyHref = interview.companyId
    ? `/companies/${interview.companyId}`
    : "/companies";

  return (
    <Card contentClassName="p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-sm font-bold text-primary">
              {interview.companyLogo ? (
                <Image
                  src={interview.companyLogo}
                  alt={`${interview.companyName} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                getCompanyInitials(interview.companyName)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/jobs/${interview.jobId}`}
                  className="text-lg font-bold text-foreground transition hover:text-primary"
                >
                  {interview.jobTitle}
                </Link>
                <InterviewStatusBadge status={interview.status} />
              </div>
              <Link
                href={companyHref}
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-primary"
              >
                <Building2 className="size-4" aria-hidden="true" />
                {interview.companyName}
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2 xl:grid-cols-4">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              {formatDate(interview.interviewDate)},{" "}
              {formatTime(interview.interviewTime, interview.interviewEndTime)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" aria-hidden="true" />
              {interviewTypeLabels[interview.interviewType]}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {interview.location ?? (canJoin ? "Meeting link available" : "To be shared")}
            </span>
            <span className="inline-flex items-center gap-2">
              <UserRound className="size-4 text-primary" aria-hidden="true" />
              {interview.interviewerName}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="neutral">
              Invited{" "}
              {new Intl.DateTimeFormat("en", {
                month: "short",
                day: "numeric",
              }).format(new Date(interview.invitedAt ?? interview.createdAt))}
            </Badge>
            {interview.feedbackAvailable ? (
              <Badge variant="success">Feedback available</Badge>
            ) : null}
          </div>

          {interview.notes || interview.feedbackSummary ? (
            <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {interview.feedbackSummary ?? interview.notes}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:w-64 lg:grid-cols-1">
          <Button
            type="button"
            size="sm"
            onClick={() => onJoinMeeting(interview)}
            disabled={!canJoin}
            leftIcon={<ExternalLink className="size-4" aria-hidden="true" />}
          >
            Join Meeting
          </Button>
          {canConfirm ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              isLoading={isConfirming}
              onClick={() => onConfirmAttendance(interview)}
            >
              Confirm Attendance
            </Button>
          ) : null}
          <Link
            href={`/profile/applications/${interview.applicationId}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            View Details
          </Link>
          <Link
            href={`/jobs/${interview.jobId}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            View Job
          </Link>
          <Link
            href={companyHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            Company Profile
          </Link>
          <a
            href={getCalendarUrl(interview)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            Add to Calendar
          </a>
          {canViewMap ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onViewMap(interview)}
            >
              View Map
            </Button>
          ) : null}
          {canRequestReschedule ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onRequestReschedule(interview)}
            >
              Request Reschedule
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
