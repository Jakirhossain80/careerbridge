"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, List } from "lucide-react";

import JobSeekerInterviewCalendarView from "@/components/job-seeker/interviews/JobSeekerInterviewCalendarView";
import JobSeekerInterviewCard from "@/components/job-seeker/interviews/JobSeekerInterviewCard";
import JobSeekerInterviewFilters from "@/components/job-seeker/interviews/JobSeekerInterviewFilters";
import JobSeekerInterviewStats from "@/components/job-seeker/interviews/JobSeekerInterviewStats";
import RequestRescheduleModal from "@/components/job-seeker/interviews/RequestRescheduleModal";
import { Button, Card, EmptyState, LoadingSkeleton, Pagination } from "@/components/ui";
import type { InterviewRescheduleFormValues } from "@/lib/validations/interview.schema";
import {
  confirmInterviewAttendance,
  getMyInterviews,
  requestInterviewReschedule,
} from "@/services/job-seeker-interviews.service";
import type {
  InterviewStatus,
  InterviewType,
  InterviewViewMode,
  JobSeekerInterview,
  JobSeekerInterviewFiltersParams,
  JobSeekerInterviewPeriod,
  JobSeekerInterviewSortBy,
} from "@/types/interview.types";

const pageSize = 6;

function readParam(searchParams: URLSearchParams, key: string, fallback = "") {
  return searchParams.get(key) ?? fallback;
}

function isPastInterview(interview: JobSeekerInterview) {
  if (["completed", "cancelled", "no_show"].includes(interview.status)) {
    return true;
  }

  return (
    new Date(`${interview.interviewDate}T${interview.interviewTime}`).getTime() <
    Date.now()
  );
}

function getNextInterview(interviews: JobSeekerInterview[]) {
  return [...interviews]
    .filter((interview) => !isPastInterview(interview))
    .sort(
      (a, b) =>
        new Date(`${a.interviewDate}T${a.interviewTime}`).getTime() -
        new Date(`${b.interviewDate}T${b.interviewTime}`).getTime(),
    )[0];
}

function InterviewsLoadingState() {
  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="text-sm font-medium text-muted">Loading interviews...</p>
        <LoadingSkeleton variant="card" rows={1} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton variant="card" rows={1} />
          <LoadingSkeleton variant="card" rows={1} />
          <LoadingSkeleton variant="card" rows={1} />
          <LoadingSkeleton variant="card" rows={1} />
        </div>
        <LoadingSkeleton variant="card" rows={4} />
      </div>
    </main>
  );
}

export default function JobSeekerInterviewsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const initialParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const [search, setSearch] = useState(() => readParam(initialParams, "search"));
  const [status, setStatus] = useState<InterviewStatus | "all">(
    () => readParam(initialParams, "status", "all") as InterviewStatus | "all",
  );
  const [interviewType, setInterviewType] = useState<InterviewType | "all">(
    () =>
      readParam(initialParams, "interviewType", "all") as InterviewType | "all",
  );
  const [period, setPeriod] = useState<JobSeekerInterviewPeriod>(
    () => readParam(initialParams, "period", "all") as JobSeekerInterviewPeriod,
  );
  const [sortBy, setSortBy] = useState<JobSeekerInterviewSortBy>(
    () =>
      readParam(
        initialParams,
        "sortBy",
        "upcoming_first",
      ) as JobSeekerInterviewSortBy,
  );
  const [page, setPage] = useState(() =>
    Number(readParam(initialParams, "page", "1")),
  );
  const [viewMode, setViewMode] = useState<InterviewViewMode>(
    () => readParam(initialParams, "view", "list") as InterviewViewMode,
  );
  const [selectedInterview, setSelectedInterview] =
    useState<JobSeekerInterview | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo<JobSeekerInterviewFiltersParams>(
    () => ({
      search: search.trim() || undefined,
      status,
      interviewType,
      period,
      sortBy,
      page,
      limit: pageSize,
    }),
    [interviewType, page, period, search, sortBy, status],
  );

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries({
      search: search.trim(),
      status,
      interviewType,
      period,
      sortBy,
      page: String(page),
      view: viewMode,
    }).forEach(([key, value]) => {
      if (
        value &&
        value !== "all" &&
        !(key === "page" && value === "1") &&
        !(key === "sortBy" && value === "upcoming_first") &&
        !(key === "view" && value === "list")
      ) {
        params.set(key, value);
      }
    });

    const nextUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [
    interviewType,
    page,
    pathname,
    period,
    router,
    search,
    sortBy,
    status,
    viewMode,
  ]);

  const interviewsQuery = useQuery({
    queryKey: ["job-seeker-interviews", filters],
    queryFn: () => getMyInterviews(filters),
    placeholderData: (previousData) => previousData,
  });

  const confirmMutation = useMutation({
    mutationFn: (interviewId: string) =>
      confirmInterviewAttendance(interviewId, { confirmed: true }),
    onSuccess: () => {
      setActionError("");
      setFeedbackMessage("Attendance confirmed successfully.");
      queryClient.invalidateQueries({ queryKey: ["job-seeker-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["job-seeker-dashboard"] });
    },
    onError: () => {
      setFeedbackMessage("");
      setActionError("Unable to confirm attendance.");
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({
      interviewId,
      payload,
    }: {
      interviewId: string;
      payload: InterviewRescheduleFormValues;
    }) => requestInterviewReschedule(interviewId, payload),
    onSuccess: () => {
      setSelectedInterview(null);
      setActionError("");
      setFeedbackMessage("Reschedule request sent successfully.");
      queryClient.invalidateQueries({ queryKey: ["job-seeker-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["job-seeker-dashboard"] });
    },
    onError: () => {
      setFeedbackMessage("");
      setActionError("Unable to request reschedule.");
    },
  });

  const data = interviewsQuery.data;
  const interviews = data?.interviews ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min((page - 1) * pageSize + interviews.length, total);
  const nextInterview = getNextInterview(interviews);
  const upcomingInterviews = interviews.filter((interview) => !isPastInterview(interview));
  const pastInterviews = interviews.filter(isPastInterview);

  function resetPage(nextAction: () => void) {
    nextAction();
    setPage(1);
  }

  function handleFilterChange(nextFilters: Partial<JobSeekerInterviewFiltersParams>) {
    resetPage(() => {
      if (nextFilters.search !== undefined) {
        setSearch(nextFilters.search);
      }
      if (nextFilters.status !== undefined) {
        setStatus(nextFilters.status);
      }
      if (nextFilters.interviewType !== undefined) {
        setInterviewType(nextFilters.interviewType);
      }
      if (nextFilters.period !== undefined) {
        setPeriod(nextFilters.period);
      }
      if (nextFilters.sortBy !== undefined) {
        setSortBy(nextFilters.sortBy);
      }
    });
  }

  function handleJoinMeeting(interview: JobSeekerInterview) {
    if (!interview.meetingLink) {
      setFeedbackMessage("");
      setActionError("Unable to join meeting because no meeting link is available.");
      return;
    }

    window.open(interview.meetingLink, "_blank", "noopener,noreferrer");
  }

  function handleViewMap(interview: JobSeekerInterview) {
    if (!interview.location) {
      setFeedbackMessage("");
      setActionError("Unable to open map because no location is available.");
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        interview.location,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function handleRescheduleSubmit(values: InterviewRescheduleFormValues) {
    if (!selectedInterview) {
      return;
    }

    rescheduleMutation.mutate({
      interviewId: selectedInterview._id,
      payload: values,
    });
  }

  if (interviewsQuery.isLoading) {
    return <InterviewsLoadingState />;
  }

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Job Seeker Portal
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Interview Invitations
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
                Manage your upcoming meetings and review past performance.
              </p>
              <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
                Showing {rangeStart}-{rangeEnd} of {total} interviews
              </p>
            </div>

            <div className="inline-flex w-fit rounded-md border border-slate-200 bg-background p-1 dark:border-slate-700">
              <Button
                type="button"
                size="sm"
                variant={viewMode === "list" ? "primary" : "ghost"}
                leftIcon={<List className="size-4" aria-hidden="true" />}
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "calendar" ? "primary" : "ghost"}
                leftIcon={<CalendarDays className="size-4" aria-hidden="true" />}
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </Button>
            </div>
          </div>
        </header>

        {feedbackMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedbackMessage}
          </div>
        ) : null}
        {actionError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        ) : null}

        <JobSeekerInterviewStats meta={data?.meta} />

        {nextInterview ? (
          <Card contentClassName="p-4 sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">Next Interview</p>
                <h2 className="mt-1 text-lg font-bold text-foreground">
                  {nextInterview.jobTitle}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {nextInterview.companyName} - {nextInterview.interviewDate} at{" "}
                  {nextInterview.interviewTime}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => handleJoinMeeting(nextInterview)}
                disabled={!nextInterview.meetingLink}
              >
                Quick Join
              </Button>
            </div>
          </Card>
        ) : null}

        <JobSeekerInterviewFilters
          search={search}
          status={status}
          interviewType={interviewType}
          period={period}
          sortBy={sortBy}
          onChange={handleFilterChange}
        />

        {interviewsQuery.isError ? (
          <Card contentClassName="p-6 text-center">
            <h2 className="font-semibold text-red-800">
              Unable to load interviews. Please try again.
            </h2>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => interviewsQuery.refetch()}
            >
              Retry
            </Button>
          </Card>
        ) : interviews.length === 0 ? (
          <EmptyState
            title="No interviews found."
            description="When employers invite you to interviews, they will appear here."
            actionLabel="View Applied Jobs"
            actionHref="/profile/applications"
          />
        ) : viewMode === "calendar" ? (
          <JobSeekerInterviewCalendarView
            interviews={interviews}
            onSelectInterview={(interview) =>
              router.push(`/profile/applications/${interview.applicationId}`)
            }
          />
        ) : (
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-foreground">
                  Upcoming Interviews
                </h2>
                <Link
                  href="/job-seeker/recommended-jobs"
                  className="text-sm font-semibold text-primary transition hover:text-blue-700"
                >
                  Browse Recommended Jobs
                </Link>
              </div>
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <JobSeekerInterviewCard
                      key={interview._id}
                      interview={interview}
                      onJoinMeeting={handleJoinMeeting}
                      onViewMap={handleViewMap}
                      onRequestReschedule={setSelectedInterview}
                      onConfirmAttendance={(item) => confirmMutation.mutate(item._id)}
                      isConfirming={
                        confirmMutation.isPending &&
                        confirmMutation.variables === interview._id
                      }
                    />
                  ))}
                </div>
              ) : (
                <Card contentClassName="p-5 text-sm text-muted">
                  No upcoming interviews match the selected filters.
                </Card>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Past Interviews</h2>
              {pastInterviews.length > 0 ? (
                <div className="space-y-4">
                  {pastInterviews.map((interview) => (
                    <JobSeekerInterviewCard
                      key={interview._id}
                      interview={interview}
                      onJoinMeeting={handleJoinMeeting}
                      onViewMap={handleViewMap}
                      onRequestReschedule={setSelectedInterview}
                      onConfirmAttendance={(item) => confirmMutation.mutate(item._id)}
                      isConfirming={
                        confirmMutation.isPending &&
                        confirmMutation.variables === interview._id
                      }
                    />
                  ))}
                </div>
              ) : (
                <Card contentClassName="p-5 text-sm text-muted">
                  No past interviews match the selected filters.
                </Card>
              )}
            </section>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="rounded-lg border border-slate-200 bg-surface px-4 py-3 dark:border-slate-700"
            />
          </div>
        )}
      </div>

      <RequestRescheduleModal
        open={Boolean(selectedInterview)}
        interview={selectedInterview}
        isSubmitting={rescheduleMutation.isPending}
        submitError={
          rescheduleMutation.isError ? "Unable to request reschedule." : undefined
        }
        onClose={() => {
          setSelectedInterview(null);
          setActionError("");
        }}
        onSubmit={handleRescheduleSubmit}
      />
    </main>
  );
}
