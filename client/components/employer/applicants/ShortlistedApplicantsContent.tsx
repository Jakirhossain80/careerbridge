"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileDown, SlidersHorizontal } from "lucide-react";

import ShortlistedApplicantCard from "@/components/employer/applicants/ShortlistedApplicantCard";
import ShortlistedApplicantsFilters from "@/components/employer/applicants/ShortlistedApplicantsFilters";
import ShortlistedStatsCards from "@/components/employer/applicants/ShortlistedStatsCards";
import { FilterEmptyState, SearchEmptyState } from "@/components/empty-states";
import { Button, EmptyState, Pagination } from "@/components/ui";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "@/services/applications.service";
import type {
  ApplicationStatus,
  EmployerApplication,
  EmployerApplicationsQueryParams,
  EmployerApplicationsResponse,
  EmployerApplicationsSortBy,
} from "@/types/application.types";

const pageSize = 5;
const sortValues: EmployerApplicationsSortBy[] = [
  "matchScore",
  "dateApplied",
  "name",
];

function getInitialSort(value: string | null): EmployerApplicationsSortBy {
  return sortValues.includes(value as EmployerApplicationsSortBy)
    ? (value as EmployerApplicationsSortBy)
    : "matchScore";
}

function getInitialPage(value: string | null) {
  const page = Number(value ?? 1);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

function exportShortlistedToCsv(applications: EmployerApplication[]) {
  const headers = [
    "Applicant Name",
    "Email",
    "Job Title",
    "Company",
    "Location",
    "Status",
    "Match Score",
    "Experience Years",
    "Expected Salary Min",
    "Expected Salary Max",
    "Applied At",
  ];
  const rows = applications.map((application) => [
    application.applicantName,
    application.applicantEmail,
    application.jobTitle,
    application.companyName ?? "",
    application.location ?? "",
    application.status,
    String(application.matchScore ?? ""),
    String(application.experienceYears ?? ""),
    String(application.expectedSalaryMin ?? ""),
    String(application.expectedSalaryMax ?? ""),
    application.appliedAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "careerbridge-shortlisted-applicants.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function ShortlistedLoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
        />
      ))}
      <p className="sr-only">Loading shortlisted applicants...</p>
    </div>
  );
}

function buildDetailsHref(applicationId: string, filters: EmployerApplicationsQueryParams) {
  const params = new URLSearchParams();
  params.set("from", "shortlisted");

  if (filters.page) {
    params.set("page", String(filters.page));
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.jobId) {
    params.set("jobId", filters.jobId);
  }

  if (filters.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.set("dateTo", filters.dateTo);
  }

  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  return `/employer/applicants/${applicationId}?${params.toString()}`;
}

export default function ShortlistedApplicantsContent() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [jobId, setJobId] = useState(searchParams.get("jobId") ?? "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") ?? "");
  const [sortBy, setSortBy] =
    useState<EmployerApplicationsSortBy>(getInitialSort(searchParams.get("sortBy")));
  const [page, setPage] = useState(getInitialPage(searchParams.get("page")));
  const [isExporting, setIsExporting] = useState(false);

  const filters = useMemo<EmployerApplicationsQueryParams>(
    () => ({
      search: search.trim() || undefined,
      status: "shortlisted",
      jobId: jobId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      page,
      limit: pageSize,
    }),
    [dateFrom, dateTo, jobId, page, search, sortBy],
  );

  const shortlistedQuery = useQuery({
    queryKey: ["shortlisted-applicants", filters],
    queryFn: () => getEmployerApplications(filters),
    placeholderData: (previousData) => previousData,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => updateApplicationStatus(applicationId, status),
    onMutate: async ({ applicationId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["shortlisted-applicants"] });

      queryClient.setQueriesData<EmployerApplicationsResponse>(
        { queryKey: ["shortlisted-applicants"] },
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          const applications = currentData.applications
            .map((application) =>
              application._id === applicationId
                ? { ...application, status }
                : application,
            )
            .filter((application) => application.status === "shortlisted");

          return {
            ...currentData,
            applications,
            total:
              status === "shortlisted"
                ? currentData.total
                : Math.max(currentData.total - 1, 0),
          };
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlisted-applicants"] });
      queryClient.invalidateQueries({ queryKey: ["employer-applicants"] });
    },
  });

  const data = shortlistedQuery.data;
  const applications = useMemo(() => data?.applications ?? [], [data?.applications]);
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min((page - 1) * pageSize + applications.length, total);
  const activeSearch = search.trim();
  const hasActiveFilters =
    Boolean(jobId || dateFrom || dateTo) || sortBy !== "matchScore";

  const jobOptions = useMemo(() => {
    const jobs = new Map<string, string>();

    applications.forEach((application) => {
      jobs.set(application.jobId, application.jobTitle);
    });

    return Array.from(jobs, ([value, label]) => ({ value, label }));
  }, [applications]);

  function resetPage(nextAction: () => void) {
    nextAction();
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setJobId("");
    setDateFrom("");
    setDateTo("");
    setSortBy("matchScore");
    setPage(1);
  }

  function clearSearch() {
    setSearch("");
    setPage(1);
  }

  function handleDownloadResume(application: EmployerApplication) {
    if (!application.resumeUrl) {
      return;
    }

    window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
  }

  function handleScheduleInterview(application: EmployerApplication) {
    window.alert(
      `Interview scheduling is ready to connect for ${application.applicantName}.`,
    );
  }

  async function handleExportAll() {
    setIsExporting(true);

    try {
      const exportData = await getEmployerApplications({
        ...filters,
        page: 1,
        limit: Math.max(total, pageSize),
      });

      exportShortlistedToCsv(exportData.applications);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Recruiter Portal
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Shortlisted Applicants
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Focus on candidates marked as shortlisted, compare match strength,
              and move the strongest applicants into interviews or offers.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
              Showing {rangeStart}-{rangeEnd} of {total} shortlisted applicants
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:pt-8">
            <Button
              type="button"
              variant="outline"
              leftIcon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
              onClick={() => {
                const filter = document.querySelector<HTMLElement>(
                  "[data-shortlisted-filters]",
                );
                filter?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Filter Status
            </Button>
            <Button
              type="button"
              variant="outline"
              leftIcon={<Download className="size-4" aria-hidden="true" />}
              onClick={() => applications.forEach(handleDownloadResume)}
              disabled={!applications.some((application) => application.resumeUrl)}
            >
              Download Resumes
            </Button>
            <Button
              type="button"
              leftIcon={<FileDown className="size-4" aria-hidden="true" />}
              isLoading={isExporting}
              onClick={handleExportAll}
              disabled={applications.length === 0}
            >
              Export All
            </Button>
          </div>
        </div>
      </header>

      <ShortlistedStatsCards
        applications={applications}
        total={total}
        meta={data?.meta}
      />

      <div data-shortlisted-filters>
        <ShortlistedApplicantsFilters
          search={search}
          jobId={jobId}
          dateFrom={dateFrom}
          dateTo={dateTo}
          sortBy={sortBy}
          jobOptions={jobOptions}
          onSearchChange={(value) => resetPage(() => setSearch(value))}
          onJobChange={(value) => resetPage(() => setJobId(value))}
          onDateFromChange={(value) => resetPage(() => setDateFrom(value))}
          onDateToChange={(value) => resetPage(() => setDateTo(value))}
          onSortChange={(value) => resetPage(() => setSortBy(value))}
          onClearFilters={clearFilters}
        />
      </div>

      {shortlistedQuery.isLoading ? (
        <ShortlistedLoadingState />
      ) : shortlistedQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
          <h2 className="font-semibold text-red-800">
            Unable to load shortlisted applicants. Please try again.
          </h2>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => shortlistedQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : applications.length === 0 ? (
        activeSearch ? (
          <SearchEmptyState query={activeSearch} onClear={clearSearch} />
        ) : hasActiveFilters ? (
          <FilterEmptyState onClear={clearFilters} />
        ) : (
          <EmptyState
            title="No shortlisted applicants found"
            description="Shortlisted candidates will appear here after you mark applicants as shortlisted."
            actionLabel="View All Applicants"
            actionHref="/employer/applicants"
          />
        )
      ) : (
        <section className="space-y-4">
          {applications.map((application) => (
            <ShortlistedApplicantCard
              key={application._id}
              application={application}
              detailsHref={buildDetailsHref(application._id, filters)}
              isUpdating={
                updateStatusMutation.isPending &&
                updateStatusMutation.variables?.applicationId === application._id
              }
              onDownloadResume={handleDownloadResume}
              onScheduleInterview={handleScheduleInterview}
              onStatusChange={(applicationId, status) =>
                updateStatusMutation.mutate({ applicationId, status })
              }
            />
          ))}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700"
          />
        </section>
      )}

      <div className="flex justify-start">
        <Link
          href="/employer/applicants"
          className="text-sm font-semibold text-primary hover:text-blue-700"
        >
          View all applicants
        </Link>
      </div>
    </div>
  );
}
