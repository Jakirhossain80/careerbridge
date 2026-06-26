"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, ShieldCheck } from "lucide-react";

import ApplicationBulkActionsBar from "@/components/admin/applications/ApplicationBulkActionsBar";
import ApplicationFilters from "@/components/admin/applications/ApplicationFilters";
import ApplicationStatsCards from "@/components/admin/applications/ApplicationStatsCards";
import ApplicationsTable from "@/components/admin/applications/ApplicationsTable";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import {
  useAdminApplicationMutations,
  useAdminApplications,
  useAdminApplicationStats,
} from "@/hooks/admin/useAdminApplications";
import { getApiErrorMessage } from "@/lib/api";
import type {
  AdminApplicationFilters,
  AdminApplicationListParams,
  AdminApplicationRecord,
  AdminApplicationsSortBy,
  AdminApplicationsTab,
  AdminApplicationStatus,
  AdminInterviewStatus,
  AdminResumeStatus,
} from "@/types/admin-application";

type RequiredFilters = Required<AdminApplicationFilters>;

type PendingStatusAction = {
  application: AdminApplicationRecord;
  status: AdminApplicationStatus;
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  tab: "all",
  status: "all",
  interviewStatus: "all",
  resumeStatus: "all",
  company: "",
  employer: "",
  job: "",
  dateFrom: "",
  dateTo: "",
  matchScore: "",
  sortBy: "newest",
  page: 1,
  limit: 10,
};

const sortMap: Record<AdminApplicationsSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  applicant_name_asc: "name",
  applicant_name_desc: "-name",
  recently_updated: "-updatedAt",
};

const backendStatusOptions: Array<{
  label: string;
  value: AdminApplicationStatus;
}> = [
  { label: "Applied", value: "applied" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under_review" },
  { label: "In Review", value: "in_review" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interview", value: "interview" },
  { label: "Offered", value: "offered" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
];

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    tab:
      (searchParams.get("tab") as AdminApplicationsTab | null) ??
      defaultFilters.tab,
    status:
      (searchParams.get("status") as AdminApplicationStatus | "all" | null) ??
      defaultFilters.status,
    interviewStatus:
      (searchParams.get("interviewStatus") as AdminInterviewStatus | "all" | null) ??
      defaultFilters.interviewStatus,
    resumeStatus:
      (searchParams.get("resumeStatus") as AdminResumeStatus | "all" | null) ??
      defaultFilters.resumeStatus,
    company: searchParams.get("company") ?? defaultFilters.company,
    employer: searchParams.get("employer") ?? defaultFilters.employer,
    job: searchParams.get("job") ?? defaultFilters.job,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    matchScore: searchParams.get("matchScore") ?? defaultFilters.matchScore,
    sortBy:
      (searchParams.get("sortBy") as AdminApplicationsSortBy | null) ??
      defaultFilters.sortBy,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
  };
}

function getApplicantLabel(application: AdminApplicationRecord) {
  if (application.applicantName) return application.applicantName;
  if (typeof application.applicantId === "object" && application.applicantId?.name) {
    return application.applicantId.name;
  }
  return application.applicantEmail ?? "this application";
}

function applyClientFilters(
  applications: AdminApplicationRecord[],
  filters: RequiredFilters,
) {
  let nextApplications = applications;

  if (filters.tab === "new") {
    const twoDaysAgo = Date.now() - 2 * 86_400_000;
    nextApplications = nextApplications.filter(
      (application) =>
        Boolean(application.createdAt) &&
        new Date(application.createdAt as string).getTime() >= twoDaysAgo,
    );
  }

  if (filters.tab === "flagged") {
    nextApplications = nextApplications.filter((application) =>
      ["flagged", "blocked"].includes(application.status),
    );
  }

  if (filters.interviewStatus !== "all") {
    nextApplications = nextApplications.filter((application) => {
      const status =
        application.interviewStatus ??
        (application.interviewScheduledAt ? "scheduled" : "not_scheduled");
      return status === filters.interviewStatus;
    });
  }

  if (filters.resumeStatus !== "all") {
    nextApplications = nextApplications.filter((application) => {
      const status =
        application.resumeStatus ??
        (application.resume || application.resumeUrl ? "uploaded" : "missing");
      return status === filters.resumeStatus;
    });
  }

  if (filters.matchScore.trim()) {
    const minimumScore = Number(filters.matchScore);
    if (Number.isFinite(minimumScore)) {
      nextApplications = nextApplications.filter(
        (application) => (application.matchScore ?? -1) >= minimumScore,
      );
    }
  }

  return nextApplications;
}

export default function ManageApplicationsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dense, setDense] = useState(false);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [statusDraft, setStatusDraft] = useState<AdminApplicationStatus>("under_review");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const apiFilters: AdminApplicationListParams = useMemo(() => {
    const searchTerms = [
      filters.search,
      filters.company,
      filters.employer,
      filters.job,
    ]
      .map((value) => value.trim())
      .filter(Boolean);

    return {
      search: searchTerms.join(" ") || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      sortBy: sortMap[filters.sortBy],
      page: filters.page,
      limit: filters.limit,
    };
  }, [filters]);

  const applicationsQuery = useAdminApplications(apiFilters);
  const statsQuery = useAdminApplicationStats();
  const { updateMutation } = useAdminApplicationMutations();
  const applications = useMemo(
    () => applyClientFilters(applicationsQuery.data?.applications ?? [], filters),
    [applicationsQuery.data?.applications, filters],
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

  function updateFilter<Key extends keyof AdminApplicationFilters>(
    key: Key,
    value: AdminApplicationFilters[Key],
  ) {
    setSelectedApplicationIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedApplicationIds([]);
    router.replace(pathname, { scroll: false });
  }

  function openStatusModal(application: AdminApplicationRecord) {
    const currentStatus = backendStatusOptions.some(
      (option) => option.value === application.status,
    )
      ? (application.status as AdminApplicationStatus)
      : "under_review";

    setStatusDraft(currentStatus);
    setStatusAction({ application, status: currentStatus });
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    updateMutation.mutate(
      {
        targetApplicationId: statusAction.application._id,
        payload: { status: statusDraft },
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Application status updated successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(
            getApiErrorMessage(error) || "Unable to update application status.",
          );
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
            Application Monitor
          </h1>
          <p className="mt-1 text-sm text-muted">
            Oversee system-wide job applications and identify potential
            anomalies.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            disabled
            title="Export reports will be enabled when the backend export endpoint is available."
            leftIcon={<Download className="size-4" aria-hidden="true" />}
          >
            Export Report
          </Button>
          <Button
            type="button"
            disabled
            title="Bulk review will be enabled when the backend bulk review endpoint is available."
            leftIcon={<ShieldCheck className="size-4" aria-hidden="true" />}
          >
            Bulk Review
          </Button>
        </div>
      </div>

      <ApplicationStatsCards
        stats={statsQuery.data}
        loading={statsQuery.isLoading}
      />

      <ApplicationFilters
        filters={filters}
        dense={dense}
        onDensityChange={setDense}
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

      {applicationsQuery.isError ? (
        <ErrorState
          title="Unable to load applications"
          message="Applications could not be loaded. Please try again."
          onRetry={() => applicationsQuery.refetch()}
        />
      ) : (
        <ApplicationsTable
          applications={applications}
          meta={applicationsQuery.data?.meta}
          loading={applicationsQuery.isLoading}
          dense={dense}
          selectedApplicationIds={selectedApplicationIds}
          onPageChange={(nextPage) => {
            setSelectedApplicationIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedApplicationIds}
          onUpdateStatus={openStatusModal}
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: application listing, search, status filtering,
        date filtering, sorting, pagination, and single status updates are
        connected. Match score, interview status, resume status, anomaly
        workflows, exports, and bulk actions are prepared for backend expansion.
      </footer>

      <ApplicationBulkActionsBar
        selectedCount={selectedApplicationIds.length}
        onClearSelection={() => setSelectedApplicationIds([])}
      />
      <Modal
        open={Boolean(statusAction)}
        title="Update application status"
        description={
          statusAction
            ? `Set ${getApplicantLabel(statusAction.application)} to ${statusDraft.replace(
                /_/g,
                " ",
              )}.`
            : ""
        }
        onClose={() => setStatusAction(null)}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setStatusAction(null)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={confirmStatusAction} isLoading={updateMutation.isPending}>
              Update Status
            </Button>
          </>
        }
      >
        {statusAction ? (
          <Select
            label="Application status"
            value={statusDraft}
            onChange={(event) =>
              setStatusDraft(event.target.value as AdminApplicationStatus)
            }
          >
            {backendStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : null}
      </Modal>
    </main>
  );
}
