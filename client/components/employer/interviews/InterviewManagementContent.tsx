"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, List, Plus } from "lucide-react";

import InterviewCalendarView from "@/components/employer/interviews/InterviewCalendarView";
import InterviewFilters from "@/components/employer/interviews/InterviewFilters";
import InterviewStatsCard from "@/components/employer/interviews/InterviewStatsCard";
import InterviewTable from "@/components/employer/interviews/InterviewTable";
import ScheduleInterviewModal from "@/components/employer/interviews/ScheduleInterviewModal";
import UpcomingInterviewCard from "@/components/employer/interviews/UpcomingInterviewCard";
import { FilterEmptyState, SearchEmptyState } from "@/components/empty-states";
import { Button, Card, ConfirmationModal, EmptyState, Pagination } from "@/components/ui";
import type { InterviewFormValues } from "@/lib/validations/interview.schema";
import {
  createInterview,
  deleteInterview,
  getEmployerInterviews,
  updateInterview,
} from "@/services/interviews.service";
import type {
  Interview,
  InterviewFiltersParams,
  InterviewSortBy,
  InterviewStatus,
  InterviewType,
  InterviewViewMode,
} from "@/types/interview.types";

const pageSize = 6;

function readParam(searchParams: URLSearchParams, key: string, fallback = "") {
  return searchParams.get(key) ?? fallback;
}

function getNextUpcoming(interviews: Interview[]) {
  const now = Date.now();

  return [...interviews]
    .filter((interview) => {
      if (["cancelled", "completed", "no_show"].includes(interview.status)) {
        return false;
      }

      return (
        new Date(`${interview.interviewDate}T${interview.interviewTime}`).getTime() >=
        now
      );
    })
    .sort(
      (a, b) =>
        new Date(`${a.interviewDate}T${a.interviewTime}`).getTime() -
        new Date(`${b.interviewDate}T${b.interviewTime}`).getTime(),
    )[0];
}

function InterviewsLoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
        />
      ))}
      <p className="sr-only">Loading interviews...</p>
    </div>
  );
}

export default function InterviewManagementContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const initialParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const [search, setSearch] = useState(() => readParam(initialParams, "search"));
  const [dateFrom, setDateFrom] = useState(() =>
    readParam(initialParams, "dateFrom"),
  );
  const [dateTo, setDateTo] = useState(() => readParam(initialParams, "dateTo"));
  const [jobTitle, setJobTitle] = useState(() =>
    readParam(initialParams, "jobTitle", "all"),
  );
  const [status, setStatus] = useState<InterviewStatus | "all">(
    () => (readParam(initialParams, "status", "all") as InterviewStatus | "all"),
  );
  const [interviewType, setInterviewType] = useState<InterviewType | "all">(
    () =>
      readParam(initialParams, "interviewType", "all") as InterviewType | "all",
  );
  const [sortBy, setSortBy] = useState<InterviewSortBy>(
    () => readParam(initialParams, "sortBy", "dateAsc") as InterviewSortBy,
  );
  const [page, setPage] = useState(() =>
    Number(readParam(initialParams, "page", "1")),
  );
  const [viewMode, setViewMode] = useState<InterviewViewMode>(
    () => readParam(initialParams, "view", "list") as InterviewViewMode,
  );
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [interviewToCancel, setInterviewToCancel] = useState<Interview | null>(
    null,
  );

  const filters = useMemo<InterviewFiltersParams>(
    () => ({
      search: search.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      jobTitle,
      status,
      interviewType,
      sortBy,
      page,
      limit: pageSize,
    }),
    [dateFrom, dateTo, interviewType, jobTitle, page, search, sortBy, status],
  );

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries({
      search: search.trim(),
      dateFrom,
      dateTo,
      jobTitle,
      status,
      interviewType,
      sortBy,
      page: String(page),
      view: viewMode,
    }).forEach(([key, value]) => {
      if (value && value !== "all" && !(key === "page" && value === "1")) {
        params.set(key, value);
      }
    });

    const nextUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [
    dateFrom,
    dateTo,
    interviewType,
    jobTitle,
    page,
    pathname,
    router,
    search,
    sortBy,
    status,
    viewMode,
  ]);

  const interviewsQuery = useQuery({
    queryKey: ["employer-interviews", filters],
    queryFn: () => getEmployerInterviews(filters),
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-interviews"] });
      setIsScheduleModalOpen(false);
      setSelectedInterview(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<InterviewFormValues>;
    }) => updateInterview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-interviews"] });
      setIsScheduleModalOpen(false);
      setSelectedInterview(null);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: deleteInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-interviews"] });
      setInterviewToCancel(null);
    },
  });

  const data = interviewsQuery.data;
  const interviews = data?.interviews ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min((page - 1) * pageSize + interviews.length, total);
  const upcomingInterview = getNextUpcoming(data?.interviews ?? []);
  const activeSearch = search.trim();
  const hasActiveFilters =
    Boolean(dateFrom || dateTo) ||
    jobTitle !== "all" ||
    status !== "all" ||
    interviewType !== "all" ||
    sortBy !== "dateAsc";

  function resetPage(nextAction: () => void) {
    nextAction();
    setPage(1);
  }

  function handleFilterChange(nextFilters: Partial<InterviewFiltersParams>) {
    resetPage(() => {
      if (nextFilters.search !== undefined) {
        setSearch(nextFilters.search);
      }
      if (nextFilters.dateFrom !== undefined) {
        setDateFrom(nextFilters.dateFrom);
      }
      if (nextFilters.dateTo !== undefined) {
        setDateTo(nextFilters.dateTo);
      }
      if (nextFilters.jobTitle !== undefined) {
        setJobTitle(nextFilters.jobTitle);
      }
      if (nextFilters.status !== undefined) {
        setStatus(nextFilters.status);
      }
      if (nextFilters.interviewType !== undefined) {
        setInterviewType(nextFilters.interviewType);
      }
      if (nextFilters.sortBy !== undefined) {
        setSortBy(nextFilters.sortBy);
      }
    });
  }

  function clearSearch() {
    setSearch("");
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setJobTitle("all");
    setStatus("all");
    setInterviewType("all");
    setSortBy("dateAsc");
    setPage(1);
  }

  function openScheduleModal(interview?: Interview | null) {
    setSelectedInterview(interview ?? null);
    setIsScheduleModalOpen(true);
  }

  function handleSubmit(values: InterviewFormValues) {
    if (selectedInterview) {
      updateMutation.mutate({
        id: selectedInterview._id,
        payload: values,
      });
      return;
    }

    createMutation.mutate(values);
  }

  function handleReschedule(interview: Interview) {
    openScheduleModal({ ...interview, status: "rescheduled" });
  }

  function handleComplete(interview: Interview) {
    updateMutation.mutate({
      id: interview._id,
      payload: { status: "completed" },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Interviews
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Interview Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Schedule, reschedule, cancel, and track interviews across active
              roles from one employer workspace.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
              Showing {rangeStart}-{rangeEnd} of {total} interviews
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pt-8">
            <div className="inline-flex rounded-md border border-slate-200 bg-background p-1 dark:border-slate-700">
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
            <Button
              type="button"
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
              onClick={() => openScheduleModal()}
            >
              Schedule New Interview
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <UpcomingInterviewCard
            interview={upcomingInterview}
            onSchedule={() => openScheduleModal()}
          />
          <InterviewFilters
            search={search}
            dateFrom={dateFrom}
            dateTo={dateTo}
            jobTitle={jobTitle}
            status={status}
            interviewType={interviewType}
            sortBy={sortBy}
            jobTitles={data?.meta.jobTitles ?? []}
            onChange={handleFilterChange}
          />
          <InterviewStatsCard meta={data?.meta} />
        </aside>

        <section className="min-w-0">
          {interviewsQuery.isLoading ? (
            <Card contentClassName="p-4 sm:p-5">
              <p className="mb-4 text-sm font-semibold text-muted">
                Loading interviews...
              </p>
              <InterviewsLoadingState />
            </Card>
          ) : interviewsQuery.isError ? (
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
            activeSearch ? (
              <SearchEmptyState query={activeSearch} onClear={clearSearch} />
            ) : hasActiveFilters ? (
              <FilterEmptyState onClear={clearFilters} />
            ) : (
              <EmptyState
                title="No interviews found"
                description="Scheduled interviews will appear here."
                actionLabel="Schedule New Interview"
                onAction={() => openScheduleModal()}
              />
            )
          ) : viewMode === "calendar" ? (
            <InterviewCalendarView
              interviews={interviews}
              onEdit={(interview) => openScheduleModal(interview)}
            />
          ) : (
            <div className="space-y-4">
              <InterviewTable
                interviews={interviews}
                loading={interviewsQuery.isFetching && !interviewsQuery.isLoading}
                onEdit={(interview) => openScheduleModal(interview)}
                onReschedule={handleReschedule}
                onComplete={handleComplete}
                onCancel={setInterviewToCancel}
              />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="rounded-lg border border-slate-200 bg-surface px-4 py-3 dark:border-slate-700"
              />
            </div>
          )}
        </section>
      </div>

      <ScheduleInterviewModal
        open={isScheduleModalOpen}
        interview={selectedInterview}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedInterview(null);
        }}
        onSubmit={handleSubmit}
      />
      <ConfirmationModal
        open={Boolean(interviewToCancel)}
        title="Cancel interview?"
        description={`The interview with ${
          interviewToCancel?.candidateName ?? "this candidate"
        } will be cancelled.`}
        confirmLabel="Cancel Interview"
        variant="destructive"
        isLoading={cancelMutation.isPending}
        onCancel={() => setInterviewToCancel(null)}
        onConfirm={() => {
          if (interviewToCancel) {
            cancelMutation.mutate(interviewToCancel._id);
          }
        }}
      />
    </div>
  );
}
