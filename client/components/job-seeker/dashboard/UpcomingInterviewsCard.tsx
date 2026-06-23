import Link from "next/link";
import { CalendarDays, Clock3, Video } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { JobSeekerUpcomingInterview } from "@/types/job-seeker-dashboard.types";

type UpcomingInterviewsCardProps = {
  interviews: JobSeekerUpcomingInterview[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function UpcomingInterviewsCard({
  interviews,
}: UpcomingInterviewsCardProps) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Upcoming Interviews
            </h2>
            <p className="mt-1 text-sm text-muted">Scheduled conversations</p>
          </div>
          <Link
            href="/job-seeker/interviews"
            className="text-sm font-semibold text-primary hover:text-blue-700"
          >
            View all
          </Link>
        </div>
      }
    >
      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {interview.jobTitle}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{interview.companyName}</p>
                </div>
                <Badge variant="primary">{interview.status}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDate(interview.interviewDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-4" aria-hidden="true" />
                  {interview.interviewTime}
                </span>
                <span className="inline-flex items-center gap-2 sm:col-span-2">
                  <Video className="size-4" aria-hidden="true" />
                  {interview.interviewType ?? "Interview"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            No upcoming interviews yet.
          </p>
          <Link
            href="/jobs"
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:text-blue-700"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </Card>
  );
}
