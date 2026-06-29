"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, UserPlus } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import JobSeekerBulkActionsBar from "@/components/admin/job-seekers/JobSeekerBulkActionsBar";
import JobSeekerFilters from "@/components/admin/job-seekers/JobSeekerFilters";
import JobSeekerStatsCards from "@/components/admin/job-seekers/JobSeekerStatsCards";
import JobSeekersTable from "@/components/admin/job-seekers/JobSeekersTable";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import {
  useAdminJobSeekerMutations,
  useAdminJobSeekers,
  useAdminJobSeekerStats,
} from "@/hooks/admin/useAdminJobSeekers";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  AdminJobSeeker,
  AdminJobSeekerFilters,
  AdminJobSeekerListParams,
  AdminJobSeekerProfileCompletionFilter,
  AdminJobSeekerResumeStatus,
  AdminJobSeekerSortBy,
  AdminJobSeekerStatus,
} from "@/types/admin-job-seeker.types";

type RequiredFilters = Required<AdminJobSeekerFilters>;

type PendingStatusAction = {
  jobSeeker: AdminJobSeeker;
  status: AdminJobSeekerStatus | "unblock";
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  status: "all",
  resumeStatus: "all",
  profileCompletion: "all",
  location: "",
  dateFrom: "",
  dateTo: "",
  page: 1,
  limit: 10,
  sortBy: "newest",
};

const sortMap: Record<AdminJobSeekerSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  name_asc: "name",
  name_desc: "-name",
  profile_completion_high: "-profileCompletion",
  profile_completion_low: "profileCompletion",
};

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    status:
      (searchParams.get("status") as AdminJobSeekerStatus | "all" | null) ??
      defaultFilters.status,
    resumeStatus:
      (searchParams.get("resumeStatus") as AdminJobSeekerResumeStatus | "all" | null) ??
      defaultFilters.resumeStatus,
    profileCompletion:
      (searchParams.get(
        "profileCompletion",
      ) as AdminJobSeekerProfileCompletionFilter | null) ??
      defaultFilters.profileCompletion,
    location: searchParams.get("location") ?? defaultFilters.location,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
    sortBy:
      (searchParams.get("sortBy") as AdminJobSeekerSortBy | null) ??
      defaultFilters.sortBy,
  };
}

function getActionCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    AdminJobSeekerStatus | "unblock",
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    active: {
      title: "Activate job seeker",
      confirmLabel: "Activate",
      verb: "activate",
    },
    pending: {
      title: "Mark job seeker pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    suspended: {
      title: "Suspend job seeker",
      confirmLabel: "Suspend",
      verb: "suspend",
      destructive: true,
    },
    blocked: {
      title: "Block job seeker",
      confirmLabel: "Block",
      verb: "block",
      destructive: true,
    },
    unblock: {
      title: "Unblock job seeker",
      confirmLabel: "Unblock",
      verb: "unblock",
    },
  };

  return labels[action.status];
}

export default function ManageJobSeekersView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedJobSeekerIds, setSelectedJobSeekerIds] = useState<string[]>([]);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const apiFilters: AdminJobSeekerListParams = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      resumeStatus:
        filters.resumeStatus !== "all" ? filters.resumeStatus : undefined,
      profileCompletion:
        filters.profileCompletion !== "all" ? filters.profileCompletion : undefined,
      location: filters.location.trim() || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      page: filters.page,
      limit: filters.limit,
      sortBy: sortMap[filters.sortBy],
    }),
    [filters],
  );

  const jobSeekersQuery = useAdminJobSeekers(apiFilters);
  const statsQuery = useAdminJobSeekerStats();
  const { statusMutation } = useAdminJobSeekerMutations();
  const actionCopy = getActionCopy(statusAction);

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

  function updateFilter<Key extends keyof AdminJobSeekerFilters>(
    key: Key,
    value: AdminJobSeekerFilters[Key],
  ) {
    setSelectedJobSeekerIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedJobSeekerIds([]);
    router.replace(pathname, { scroll: false });
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    const nextStatus =
      statusAction.status === "unblock" ? "active" : statusAction.status;

    statusMutation.mutate(
      {
        targetJobSeekerId: statusAction.jobSeeker._id,
        status: nextStatus,
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Job seeker status updated successfully.");
          setActionError("");
          appToast.success("Job seeker status updated successfully.");
        },
        onError: (error) => {
          const message =
            getApiErrorMessage(error) || "Unable to update job seeker status.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Job Seekers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage and monitor job seeker accounts across the platform.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            disabled
            title="CSV export will be enabled when the export endpoint is available."
            leftIcon={<Download className="size-4" aria-hidden="true" />}
          >
            Export CSV
          </Button>
          <Button
            type="button"
            disabled
            title="Invites will be enabled when the invite-user endpoint is available."
            leftIcon={<UserPlus className="size-4" aria-hidden="true" />}
          >
            Invite User
          </Button>
        </div>
      </div>

      <JobSeekerStatsCards
        stats={statsQuery.data}
        loading={statsQuery.isLoading}
      />

      <JobSeekerFilters
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

      {jobSeekersQuery.isError ? (
        <ErrorState
          title="Unable to load job seekers"
          message="Job seeker accounts could not be loaded. Please try again."
          onRetry={() => jobSeekersQuery.refetch()}
        />
      ) : (
        <JobSeekersTable
          jobSeekers={jobSeekersQuery.data?.jobSeekers ?? []}
          meta={jobSeekersQuery.data?.meta}
          loading={jobSeekersQuery.isLoading}
          selectedJobSeekerIds={selectedJobSeekerIds}
          onPageChange={(nextPage) => {
            setSelectedJobSeekerIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedJobSeekerIds}
          onChangeStatus={(jobSeeker, status) =>
            setStatusAction({ jobSeeker, status })
          }
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: job seeker list, filters, stats, and moderation are
        connected. Bulk moderation and CSV export are prepared for backend
        expansion.
      </footer>

      <JobSeekerBulkActionsBar
        selectedCount={selectedJobSeekerIds.length}
        onClearSelection={() => setSelectedJobSeekerIds([])}
      />
      <ConfirmActionModal
        open={Boolean(statusAction && actionCopy)}
        title={actionCopy?.title ?? ""}
        description={
          statusAction && actionCopy
            ? `This will ${actionCopy.verb} ${statusAction.jobSeeker.name} (${statusAction.jobSeeker.email}).`
            : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        isLoading={statusMutation.isPending}
        onClose={() => setStatusAction(null)}
        onConfirm={confirmStatusAction}
      />
    </main>
  );
}
