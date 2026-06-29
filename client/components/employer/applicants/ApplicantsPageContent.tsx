"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, FileDown } from "lucide-react";

import ApplicantCard from "@/components/employer/applicants/ApplicantCard";
import ApplicantFilters from "@/components/employer/applicants/ApplicantFilters";
import ApplicantProfileModal from "@/components/employer/applicants/ApplicantProfileModal";
import { FilterEmptyState, SearchEmptyState } from "@/components/empty-states";
import { Button, Card, EmptyState, Pagination } from "@/components/ui";
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
  EmployerApplicationsStatusFilter,
} from "@/types/application.types";

const pageSize = 5;

function exportApplicationsToCsv(applications: EmployerApplication[]) {
  const headers = [
    "Applicant Name",
    "Email",
    "Job Title",
    "Status",
    "Match Score",
    "Experience Years",
    "Applied At",
  ];
  const rows = applications.map((application) => [
    application.applicantName,
    application.applicantEmail,
    application.jobTitle,
    application.status,
    String(application.matchScore ?? ""),
    String(application.experienceYears ?? ""),
    application.appliedAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${cell.replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "careerbridge-applicants.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildStatusCounts(
  data?: EmployerApplicationsResponse,
): Record<EmployerApplicationsStatusFilter, number> {
  const counts: Record<EmployerApplicationsStatusFilter, number> = {
    all: data?.total ?? 0,
    applied: 0,
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
  };

  data?.applications.forEach((application) => {
    counts[application.status] += 1;
  });

  return counts;
}

function ApplicantsLoadingState() {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
        />
      ))}
      <p className="sr-only">Loading applicants...</p>
    </div>
  );
}

export default function ApplicantsPageContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<EmployerApplicationsStatusFilter>("all");
  const [sortBy, setSortBy] =
    useState<EmployerApplicationsSortBy>("matchScore");
  const [page, setPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<EmployerApplication | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const filters = useMemo<EmployerApplicationsQueryParams>(
    () => ({
      search: search.trim() || undefined,
      status,
      sortBy,
      page,
      limit: pageSize,
    }),
    [page, search, sortBy, status],
  );

  const applicantsQuery = useQuery({
    queryKey: ["employer-applicants", filters],
    queryFn: () => getEmployerApplications(filters),
    placeholderData: (previousData) => previousData,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status: nextStatus,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => updateApplicationStatus(applicationId, nextStatus),
    onMutate: async ({ applicationId, status: nextStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["employer-applicants"] });

      queryClient.setQueriesData<EmployerApplicationsResponse>(
        { queryKey: ["employer-applicants"] },
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            applications: currentData.applications.map((application) =>
              application._id === applicationId
                ? { ...application, status: nextStatus }
                : application,
            ),
          };
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-applicants"] });
    },
  });

  const applications = applicantsQuery.data?.applications ?? [];
  const total = applicantsQuery.data?.total ?? 0;
  const totalPages = applicantsQuery.data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min((page - 1) * pageSize + applications.length, total);
  const statusCounts = buildStatusCounts(applicantsQuery.data);
  const activeSearch = search.trim();
  const hasActiveFilters = status !== "all" || sortBy !== "matchScore";

  function resetPage(nextAction: () => void) {
    nextAction();
    setPage(1);
  }

  function handleViewProfile(application: EmployerApplication) {
    setSelectedApplication(application);
    setIsProfileModalOpen(true);
    queryClient.prefetchQuery({
      queryKey: ["application", application._id],
      queryFn: () => Promise.resolve(application),
    });
  }

  function handleDownloadResume(application: EmployerApplication) {
    if (!application.resumeUrl) {
      return;
    }

    window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownloadAllResumes() {
    applications
      .filter((application) => application.resumeUrl)
      .forEach((application) => handleDownloadResume(application));
  }

  function clearSearch() {
    setSearch("");
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setSortBy("matchScore");
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href="/employer/dashboard/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Job Listings
            </Link>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Applicants
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Job Applicants
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Review applicants across open roles, compare match strength, and
              move candidates through the hiring pipeline.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
              Showing {rangeStart}-{rangeEnd} of {total} applicants
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pt-8">
            <Button
              type="button"
              variant="outline"
              leftIcon={<Download className="size-4" aria-hidden="true" />}
              onClick={handleDownloadAllResumes}
              disabled={!applications.some((application) => application.resumeUrl)}
            >
              Download All Resumes
            </Button>
            <Button
              type="button"
              leftIcon={<FileDown className="size-4" aria-hidden="true" />}
              onClick={() => exportApplicationsToCsv(applications)}
              disabled={applications.length === 0}
            >
              Export to CSV
            </Button>
          </div>
        </div>
      </header>

      <Card
        className="shadow-sm"
        contentClassName="space-y-5 p-4 sm:p-5"
      >
        <ApplicantFilters
          search={search}
          status={status}
          sortBy={sortBy}
          statusCounts={statusCounts}
          onSearchChange={(value) =>
            resetPage(() => {
              setSearch(value);
            })
          }
          onStatusChange={(value) =>
            resetPage(() => {
              setStatus(value);
            })
          }
          onSortChange={(value) =>
            resetPage(() => {
              setSortBy(value);
            })
          }
        />

        {applicantsQuery.isLoading ? (
          <ApplicantsLoadingState />
        ) : applicantsQuery.isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <h2 className="font-semibold text-red-800">
              Unable to load applicants. Please try again.
            </h2>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => applicantsQuery.refetch()}
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
              title="No applicants found"
              description="Applicants will appear here after candidates apply to your jobs."
            />
          )
        ) : (
          <>
            <div className="space-y-3">
              {applications.map((application) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  isUpdating={
                    updateStatusMutation.isPending &&
                    updateStatusMutation.variables?.applicationId ===
                      application._id
                  }
                  onViewProfile={handleViewProfile}
                  onDownloadResume={handleDownloadResume}
                  onStatusChange={(applicationId, nextStatus) =>
                    updateStatusMutation.mutate({
                      applicationId,
                      status: nextStatus,
                    })
                  }
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="border-t border-slate-200 pt-5 dark:border-slate-700"
            />
          </>
        )}
      </Card>

      <ApplicantProfileModal
        application={selectedApplication}
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onDownloadResume={handleDownloadResume}
      />
    </div>
  );
}
