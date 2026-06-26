"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Download, Filter } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import JobFiltersBar from "@/components/admin/jobs/JobFiltersBar";
import PendingJobBulkActionsBar from "@/components/admin/jobs/pending/PendingJobBulkActionsBar";
import PendingJobStatsCards from "@/components/admin/jobs/pending/PendingJobStatsCards";
import PendingJobTabs from "@/components/admin/jobs/pending/PendingJobTabs";
import PendingJobsTable from "@/components/admin/jobs/pending/PendingJobsTable";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useAdminJobMutations, usePendingJobs } from "@/hooks/admin/useAdminJobs";
import { getApiErrorMessage } from "@/lib/api";
import type {
  AdminJob,
  AdminJobApprovalStatus,
  AdminJobFilters,
  AdminJobListParams,
  AdminJobSortBy,
  AdminJobStatus,
  PendingJobQueueTab,
} from "@/types/admin-job.types";

type RequiredFilters = Required<AdminJobFilters>;

type PendingStatusAction = {
  job: AdminJob;
  status: AdminJobStatus;
} | null;

type PendingApprovalAction = {
  job: AdminJob;
  status: AdminJobApprovalStatus;
} | null;

type RequestChangesAction = {
  job: AdminJob;
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  status: "pending",
  approvalStatus: "all",
  category: "",
  jobType: "all",
  workMode: "all",
  experienceLevel: "",
  company: "",
  employer: "",
  deadlineFrom: "",
  deadlineTo: "",
  dateFrom: "",
  dateTo: "",
  page: 1,
  limit: 10,
  sortBy: "newest",
  queue: "all",
};

const sortMap: Record<AdminJobSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  title_asc: "title",
  title_desc: "-title",
  most_applications: "-updatedAt",
  least_applications: "updatedAt",
  recently_updated: "-updatedAt",
  upcoming_deadlines: "updatedAt",
};

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    status:
      (searchParams.get("status") as AdminJobStatus | "all" | null) ??
      defaultFilters.status,
    approvalStatus:
      (searchParams.get("approvalStatus") as AdminJobApprovalStatus | "all" | null) ??
      defaultFilters.approvalStatus,
    category: searchParams.get("category") ?? defaultFilters.category,
    jobType:
      (searchParams.get("jobType") as RequiredFilters["jobType"] | null) ??
      defaultFilters.jobType,
    workMode:
      (searchParams.get("workMode") as RequiredFilters["workMode"] | null) ??
      defaultFilters.workMode,
    experienceLevel:
      searchParams.get("experienceLevel") ?? defaultFilters.experienceLevel,
    company: searchParams.get("company") ?? defaultFilters.company,
    employer: searchParams.get("employer") ?? defaultFilters.employer,
    deadlineFrom: searchParams.get("deadlineFrom") ?? defaultFilters.deadlineFrom,
    deadlineTo: searchParams.get("deadlineTo") ?? defaultFilters.deadlineTo,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
    sortBy:
      (searchParams.get("sortBy") as AdminJobSortBy | null) ??
      defaultFilters.sortBy,
    queue:
      (searchParams.get("queue") as PendingJobQueueTab | null) ??
      defaultFilters.queue,
  };
}

function getStatusCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    AdminJobStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    draft: { title: "Move job to draft", confirmLabel: "Move to Draft", verb: "move to draft" },
    pending: { title: "Mark job pending", confirmLabel: "Mark Pending", verb: "mark pending" },
    active: { title: "Activate job", confirmLabel: "Activate", verb: "activate" },
    published: { title: "Publish job", confirmLabel: "Publish", verb: "publish" },
    expired: { title: "Expire job", confirmLabel: "Expire", verb: "expire" },
    archived: { title: "Archive job", confirmLabel: "Archive", verb: "archive" },
    closed: {
      title: "Close job",
      confirmLabel: "Close",
      verb: "close",
      destructive: true,
    },
    rejected: {
      title: "Reject job",
      confirmLabel: "Reject",
      verb: "reject",
      destructive: true,
    },
  };

  return labels[action.status];
}

function getApprovalCopy(action: PendingApprovalAction) {
  if (!action) return null;

  const labels: Record<
    AdminJobApprovalStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    pending_review: {
      title: "Send job to review",
      confirmLabel: "Send to Review",
      verb: "send to review",
    },
    under_review: {
      title: "Mark job under review",
      confirmLabel: "Mark Under Review",
      verb: "mark under review",
    },
    approved: {
      title: "Approve job",
      confirmLabel: "Approve",
      verb: "approve",
    },
    rejected: {
      title: "Reject job",
      confirmLabel: "Reject",
      verb: "reject",
      destructive: true,
    },
  };

  return labels[action.status];
}

function normalizeStatus(status: AdminJobStatus): AdminJobStatus {
  if (status === "expired") return "closed";
  if (status === "published") return "active";
  return status;
}

function isHighRisk(job: AdminJob) {
  return (
    job.riskLevel === "high" ||
    job.riskLevel === "critical" ||
    (job.riskScore ?? 0) >= 70
  );
}

function applyQueueFilter(jobs: AdminJob[], queue: PendingJobQueueTab) {
  if (queue === "high_risk") return jobs.filter(isHighRisk);
  if (queue === "updates") {
    return jobs.filter(
      (job) =>
        Boolean(job.updatedAt && job.createdAt && job.updatedAt !== job.createdAt),
    );
  }

  return jobs;
}

export default function PendingJobsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [approvalAction, setApprovalAction] = useState<PendingApprovalAction>(null);
  const [requestChangesAction, setRequestChangesAction] =
    useState<RequestChangesAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const apiFilters: AdminJobListParams = useMemo(() => {
    const searchTerms = [
      filters.search,
      filters.category,
      filters.company,
      filters.employer,
      filters.experienceLevel,
      filters.jobType !== "all" ? filters.jobType : "",
      filters.workMode !== "all" ? filters.workMode : "",
    ]
      .map((value) => value.trim())
      .filter(Boolean);

    return {
      search: searchTerms.join(" ") || undefined,
      status:
        filters.status !== "all" ? normalizeStatus(filters.status) : "pending",
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      page: filters.page,
      limit: filters.limit,
      sortBy: sortMap[filters.sortBy],
    };
  }, [filters]);

  const jobsQuery = usePendingJobs(apiFilters);
  const { approvalMutation, archiveMutation, statusMutation } = useAdminJobMutations();
  const statusCopy = getStatusCopy(statusAction);
  const approvalCopy = getApprovalCopy(approvalAction);
  const jobs = useMemo(
    () => applyQueueFilter(jobsQuery.data?.jobs ?? [], filters.queue),
    [filters.queue, jobsQuery.data?.jobs],
  );

  function setQueryParams(nextFilters: Partial<RequiredFilters>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...nextFilters };

    Object.entries(merged).forEach(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof RequiredFilters];

      if (value === "" || value === "all" || value === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }

  function updateFilter<Key extends keyof AdminJobFilters>(
    key: Key,
    value: AdminJobFilters[Key],
  ) {
    setSelectedJobIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedJobIds([]);
    router.replace(pathname, { scroll: false });
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    if (statusAction.status === "archived") {
      archiveMutation.mutate(
        { targetJobId: statusAction.job._id },
        {
          onSuccess: () => {
            setStatusAction(null);
            setFeedbackMessage("Job archived successfully.");
            setActionError("");
          },
          onError: (error) => {
            setActionError(getApiErrorMessage(error) || "Unable to archive job.");
          },
        },
      );
      return;
    }

    statusMutation.mutate(
      {
        targetJobId: statusAction.job._id,
        status: normalizeStatus(statusAction.status),
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Job status updated successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error) || "Unable to update job status.");
        },
      },
    );
  }

  function confirmApprovalAction() {
    if (!approvalAction) return;

    approvalMutation.mutate(
      {
        targetJobId: approvalAction.job._id,
        approvalStatus: approvalAction.status,
      },
      {
        onSuccess: () => {
          setApprovalAction(null);
          setFeedbackMessage("Job review decision saved successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(
            getApiErrorMessage(error) || "Unable to save job review decision.",
          );
        },
      },
    );
  }

  function confirmRequestChanges() {
    if (!requestChangesAction) return;

    setRequestChangesAction(null);
    setFeedbackMessage(
      "Request changes workflow is prepared and will activate when the backend endpoint is available.",
    );
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm font-medium text-muted"
          >
            <Link href="/admin/jobs" className="hover:text-primary">
              Jobs
            </Link>
            <ChevronRight className="size-4" aria-hidden="true" />
            <span className="text-slate-900">Approval Queue</span>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Job Approval Queue
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review and moderate submitted job listings before they go live.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            disabled
            title="Filters are available in the filter panel below."
            leftIcon={<Filter className="size-4" aria-hidden="true" />}
          >
            Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled
            title="CSV export will be enabled when the export endpoint is available."
            leftIcon={<Download className="size-4" aria-hidden="true" />}
          >
            Export List
          </Button>
        </div>
      </div>

      <PendingJobStatsCards
        jobs={jobs}
        meta={jobsQuery.data?.meta}
        loading={jobsQuery.isLoading}
      />

      <PendingJobTabs
        activeTab={filters.queue}
        onTabChange={(queue) => {
          setSelectedJobIds([]);
          setQueryParams({ queue, page: 1 });
        }}
      />

      <JobFiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {feedbackMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {feedbackMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {actionError}
        </div>
      ) : null}

      {jobsQuery.isError ? (
        <ErrorState
          title="Unable to load pending jobs"
          message="Pending job listings could not be loaded. Please try again."
          onRetry={() => jobsQuery.refetch()}
        />
      ) : (
        <PendingJobsTable
          jobs={jobs}
          meta={jobsQuery.data?.meta}
          loading={jobsQuery.isLoading}
          selectedJobIds={selectedJobIds}
          onPageChange={(nextPage) => {
            setSelectedJobIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedJobIds}
          onChangeStatus={(job, status) => setStatusAction({ job, status })}
          onChangeApproval={(job, status) => setApprovalAction({ job, status })}
          onRequestChanges={(job) => setRequestChangesAction({ job })}
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: pending queue listing, search, filters, sorting,
        pagination, approve, reject, activate, close, and archive use existing
        admin job APIs. Dedicated pending endpoint, request changes, risk scoring,
        review analytics, export, and bulk moderation are prepared for backend
        expansion.
      </footer>

      <PendingJobBulkActionsBar
        selectedCount={selectedJobIds.length}
        onClearSelection={() => setSelectedJobIds([])}
      />
      <ConfirmActionModal
        open={Boolean(statusAction && statusCopy)}
        title={statusCopy?.title ?? ""}
        description={
          statusAction && statusCopy
            ? `This will ${statusCopy.verb} ${statusAction.job.title}.`
            : ""
        }
        confirmLabel={statusCopy?.confirmLabel}
        destructive={statusCopy?.destructive}
        isLoading={statusMutation.isPending || archiveMutation.isPending}
        onClose={() => setStatusAction(null)}
        onConfirm={confirmStatusAction}
      />
      <ConfirmActionModal
        open={Boolean(approvalAction && approvalCopy)}
        title={approvalCopy?.title ?? ""}
        description={
          approvalAction && approvalCopy
            ? `This will ${approvalCopy.verb} ${approvalAction.job.title}.`
            : ""
        }
        confirmLabel={approvalCopy?.confirmLabel}
        destructive={approvalCopy?.destructive}
        isLoading={approvalMutation.isPending}
        onClose={() => setApprovalAction(null)}
        onConfirm={confirmApprovalAction}
      />
      <ConfirmActionModal
        open={Boolean(requestChangesAction)}
        title="Request job changes"
        description={
          requestChangesAction
            ? `This will prepare a request for changes on ${requestChangesAction.job.title}.`
            : ""
        }
        confirmLabel="Request Changes"
        onClose={() => setRequestChangesAction(null)}
        onConfirm={confirmRequestChanges}
      />
    </main>
  );
}
