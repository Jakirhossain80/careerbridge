"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Plus, RotateCcw } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import FeaturedJobBulkActionsBar from "@/components/admin/jobs/featured/FeaturedJobBulkActionsBar";
import FeaturedJobStatsCards from "@/components/admin/jobs/featured/FeaturedJobStatsCards";
import FeaturedJobsTable from "@/components/admin/jobs/featured/FeaturedJobsTable";
import FeatureJobModal from "@/components/admin/jobs/featured/FeatureJobModal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  useAdminFeaturedJobMutations,
  useAdminFeaturedJobs,
  useAdminFeaturedJobStats,
} from "@/hooks/admin/useAdminFeaturedJobs";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  AdminFeaturedJob,
  AdminFeaturedJobFilters,
  AdminFeaturedJobListParams,
  FeaturedPromotionPriority,
  FeaturedPromotionStatus,
  FeatureJobPayload,
} from "@/types/admin-featured-job";

type RequiredFilters = Required<AdminFeaturedJobFilters>;

type PendingStatusAction = {
  featuredJob: AdminFeaturedJob;
  status: FeaturedPromotionStatus;
} | null;

type PendingRemoveAction = {
  featuredJob: AdminFeaturedJob;
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  status: "all",
  priority: "all",
  page: 1,
  limit: 10,
};

const statusOptions: Array<{ label: string; value: FeaturedPromotionStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Paused", value: "paused" },
  { label: "Expired", value: "expired" },
];

const priorityOptions: Array<{
  label: string;
  value: FeaturedPromotionPriority | "all";
}> = [
  { label: "All priorities", value: "all" },
  { label: "Standard", value: "standard" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Ultra", value: "ultra" },
];

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    status:
      (searchParams.get("status") as FeaturedPromotionStatus | "all" | null) ??
      defaultFilters.status,
    priority:
      (searchParams.get("priority") as FeaturedPromotionPriority | "all" | null) ??
      defaultFilters.priority,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
  };
}

function getStatusCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    FeaturedPromotionStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    active: { title: "Activate promotion", confirmLabel: "Activate", verb: "activate" },
    pending: { title: "Mark promotion pending", confirmLabel: "Mark Pending", verb: "mark pending" },
    paused: {
      title: "Pause promotion",
      confirmLabel: "Pause",
      verb: "pause",
      destructive: true,
    },
    expired: {
      title: "Expire promotion",
      confirmLabel: "Expire",
      verb: "expire",
      destructive: true,
    },
  };

  return labels[action.status];
}

export default function FeaturedJobsManagementView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedPromotionIds, setSelectedPromotionIds] = useState<string[]>([]);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [removeAction, setRemoveAction] = useState<PendingRemoveAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const apiFilters: AdminFeaturedJobListParams = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      status: filters.status,
      priority: filters.priority,
      page: filters.page,
      limit: filters.limit,
    }),
    [filters],
  );

  const featuredJobsQuery = useAdminFeaturedJobs(apiFilters);
  const statsQuery = useAdminFeaturedJobStats();
  const { featureMutation, removeMutation, updateMutation } =
    useAdminFeaturedJobMutations();
  const statusCopy = getStatusCopy(statusAction);

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

  function updateFilter<Key extends keyof AdminFeaturedJobFilters>(
    key: Key,
    value: AdminFeaturedJobFilters[Key],
  ) {
    setSelectedPromotionIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedPromotionIds([]);
    router.replace(pathname, { scroll: false });
  }

  function featureJob(payload: FeatureJobPayload) {
    featureMutation.mutate(payload, {
      onSuccess: () => {
        setFeatureModalOpen(false);
        setFeedbackMessage("Job featured successfully.");
        setActionError("");
        appToast.success("Job featured successfully.");
      },
      onError: (error) => {
        const message = getApiErrorMessage(error) || "Unable to feature job.";
        setActionError(message);
        appToast.error(message);
      },
    });
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    updateMutation.mutate(
      {
        promotionId: statusAction.featuredJob.promotionId,
        payload: { status: statusAction.status },
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Featured promotion status updated.");
          setActionError("");
          appToast.success("Featured promotion status updated.");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error) || "Unable to update promotion status.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function confirmRemoveAction() {
    if (!removeAction) return;

    removeMutation.mutate(
      { promotionId: removeAction.featuredJob.promotionId },
      {
        onSuccess: () => {
          setRemoveAction(null);
          setFeedbackMessage("Job removed from featured promotions.");
          setActionError("");
          appToast.success("Job removed from featured promotions.");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error) || "Unable to remove featured job.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function changePriority(
    featuredJob: AdminFeaturedJob,
    priority: FeaturedPromotionPriority,
  ) {
    setFeedbackMessage(
      `${featuredJob.title} priority is prepared as ${priority}. Dedicated promotion priority persistence requires the featured jobs backend endpoint.`,
    );
    setActionError("");
    appToast.info("Promotion priority persistence is not available yet.");
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Featured Jobs Management
          </h1>
          <p className="mt-1 text-sm text-muted">
            Promote listings and monitor their reach across the platform.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            disabled
            title="Export will be enabled when the backend export endpoint is available."
            leftIcon={<Download className="size-4" aria-hidden="true" />}
          >
            Export
          </Button>
          <Button
            type="button"
            onClick={() => setFeatureModalOpen(true)}
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
          >
            Feature New Job
          </Button>
        </div>
      </div>

      <FeaturedJobStatsCards
        stats={statsQuery.data}
        loading={statsQuery.isLoading}
      />

      <section className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
          <Input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search featured jobs by title, company, category, or location"
            aria-label="Search featured jobs"
            className="h-11"
          />
          <Select
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value as FeaturedPromotionStatus | "all",
              )
            }
            aria-label="Filter featured jobs by status"
            className="h-11"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={filters.priority}
            onChange={(event) =>
              updateFilter(
                "priority",
                event.target.value as FeaturedPromotionPriority | "all",
              )
            }
            aria-label="Filter featured jobs by priority"
            className="h-11"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={resetFilters}
            leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
          >
            Reset
          </Button>
        </div>
      </section>

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

      {featuredJobsQuery.isError ? (
        <ErrorState
          title="Unable to load featured jobs"
          message="Featured promotions could not be loaded. Please try again."
          onRetry={() => featuredJobsQuery.refetch()}
        />
      ) : (
        <FeaturedJobsTable
          featuredJobs={featuredJobsQuery.data?.featuredJobs ?? []}
          meta={featuredJobsQuery.data?.meta}
          loading={featuredJobsQuery.isLoading}
          selectedPromotionIds={selectedPromotionIds}
          onPageChange={(nextPage) => {
            setSelectedPromotionIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedPromotionIds}
          onChangePriority={changePriority}
          onChangeStatus={(featuredJob, status) =>
            setStatusAction({ featuredJob, status })
          }
          onRemove={(featuredJob) => setRemoveAction({ featuredJob })}
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: featured listing, add featured job, pause/remove, search,
        filters, and pagination use existing admin job APIs. Priority persistence,
        impressions, clicks, revenue, export, and dedicated promotion lifecycle
        controls are prepared for the featured jobs backend endpoints.
      </footer>

      <FeaturedJobBulkActionsBar
        selectedCount={selectedPromotionIds.length}
        onClearSelection={() => setSelectedPromotionIds([])}
      />
      <FeatureJobModal
        open={featureModalOpen}
        isLoading={featureMutation.isPending}
        onClose={() => setFeatureModalOpen(false)}
        onSubmit={featureJob}
      />
      <ConfirmActionModal
        open={Boolean(statusAction && statusCopy)}
        title={statusCopy?.title ?? ""}
        description={
          statusAction && statusCopy
            ? `This will ${statusCopy.verb} ${statusAction.featuredJob.title}.`
            : ""
        }
        confirmLabel={statusCopy?.confirmLabel}
        destructive={statusCopy?.destructive}
        isLoading={updateMutation.isPending}
        onClose={() => setStatusAction(null)}
        onConfirm={confirmStatusAction}
      />
      <ConfirmActionModal
        open={Boolean(removeAction)}
        title="Remove featured promotion"
        description={
          removeAction
            ? `This will remove ${removeAction.featuredJob.title} from featured jobs.`
            : ""
        }
        confirmLabel="Remove"
        destructive
        isLoading={removeMutation.isPending}
        onClose={() => setRemoveAction(null)}
        onConfirm={confirmRemoveAction}
      />
    </main>
  );
}
