"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Filter, Plus } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import JobBulkActionsBar from "@/components/admin/jobs/JobBulkActionsBar";
import JobFiltersBar from "@/components/admin/jobs/JobFiltersBar";
import JobInsightsCards from "@/components/admin/jobs/JobInsightsCards";
import JobsTable from "@/components/admin/jobs/JobsTable";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useAdminJobMutations, useAdminJobs } from "@/hooks/admin/useAdminJobs";
import { getApiErrorMessage } from "@/lib/api";
import type {
  AdminJob,
  AdminJobApprovalStatus,
  AdminJobFilters,
  AdminJobListParams,
  AdminJobSortBy,
  AdminJobStatus,
} from "@/types/admin-job.types";

type RequiredFilters = Required<AdminJobFilters>;

type PendingStatusAction = {
  job: AdminJob;
  status: AdminJobStatus | "delete";
} | null;

type PendingApprovalAction = {
  job: AdminJob;
  status: AdminJobApprovalStatus;
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  status: "all",
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
};

const sortMap: Record<AdminJobSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  title_asc: "title",
  title_desc: "-title",
  most_applications: "-updatedAt",
  least_applications: "updatedAt",
  recently_updated: "-updatedAt",
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
  };
}

function getStatusCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    AdminJobStatus | "delete",
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
    delete: {
      title: "Delete job",
      confirmLabel: "Delete",
      verb: "delete",
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

function getSupportedJobStatus(status: AdminJobStatus): AdminJobStatus {
  if (status === "expired") return "closed";
  if (status === "published") return "active";
  return status;
}

export default function ManageJobsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [approvalAction, setApprovalAction] = useState<PendingApprovalAction>(null);
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
        filters.status !== "all" ? getSupportedJobStatus(filters.status) : undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      page: filters.page,
      limit: filters.limit,
      sortBy: sortMap[filters.sortBy],
    };
  }, [filters]);

  const jobsQuery = useAdminJobs(apiFilters);
  const { approvalMutation, archiveMutation, statusMutation } = useAdminJobMutations();
  const statusCopy = getStatusCopy(statusAction);
  const approvalCopy = getApprovalCopy(approvalAction);

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

    if (statusAction.status === "delete" || statusAction.status === "archived") {
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
        status: getSupportedJobStatus(statusAction.status),
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
          setFeedbackMessage("Job moderation status updated successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(
            getApiErrorMessage(error) || "Unable to update job moderation status.",
          );
        },
      },
    );
  }

  const jobs = jobsQuery.data?.jobs ?? [];

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Manage Job Listings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Oversee, moderate, and optimize all active postings across the
            CareerBridge network.
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
          <Button
            type="button"
            disabled
            title="Admin job creation will be enabled when the create-job endpoint is available."
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
          >
            Create New Job
          </Button>
        </div>
      </div>

      <JobInsightsCards
        jobs={jobs}
        meta={jobsQuery.data?.meta}
        loading={jobsQuery.isLoading}
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
          title="Unable to load jobs"
          message="Job listings could not be loaded. Please try again."
          onRetry={() => jobsQuery.refetch()}
        />
      ) : (
        <JobsTable
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
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: job listing, search, status moderation, approval
        moderation, archive, sorting, and pagination are connected to existing
        admin APIs. Bulk actions, export, hard delete, and dedicated analytics
        are prepared for backend expansion.
      </footer>

      <JobBulkActionsBar
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
    </main>
  );
}
