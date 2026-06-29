"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, SlidersHorizontal } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import PendingEmployerBulkActionsBar from "@/components/admin/employers/pending/PendingEmployerBulkActionsBar";
import PendingEmployerFiltersPanel from "@/components/admin/employers/pending/PendingEmployerFilters";
import PendingEmployerStatsCards from "@/components/admin/employers/pending/PendingEmployerStatsCards";
import PendingEmployersTable from "@/components/admin/employers/pending/PendingEmployersTable";
import RejectEmployerModal from "@/components/admin/employers/pending/RejectEmployerModal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import {
  usePendingEmployerMutations,
  usePendingEmployers,
} from "@/hooks/admin/usePendingEmployers";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  AdminEmployerAccountStatus,
  AdminEmployerSortBy,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";
import type {
  PendingEmployer,
  PendingEmployerFilters as PendingEmployerFilterValues,
  PendingEmployerListParams,
  PendingEmployerVerificationStatus,
  RejectEmployerPayload,
} from "@/types/admin-employer-verification";

type RequiredFilters = Required<PendingEmployerFilterValues>;

type PendingVerificationAction = {
  employer: PendingEmployer;
  status: AdminEmployerVerificationStatus;
} | null;

type PendingAccountAction = {
  employer: PendingEmployer;
  status: AdminUserStatus | "unblock";
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  accountStatus: "all",
  verificationStatus: "all",
  industry: "",
  companySize: "",
  dateFrom: "",
  dateTo: "",
  submittedFrom: "",
  submittedTo: "",
  page: 1,
  limit: 10,
  sortBy: "newest",
};

const sortMap: Record<AdminEmployerSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  company_name_asc: "name",
  company_name_desc: "-name",
  recently_active: "-updatedAt",
  verification_status: "-updatedAt",
};

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    accountStatus:
      (searchParams.get("accountStatus") as AdminEmployerAccountStatus | "all" | null) ??
      defaultFilters.accountStatus,
    verificationStatus:
      (searchParams.get(
        "verificationStatus",
      ) as PendingEmployerVerificationStatus | "all" | null) ??
      defaultFilters.verificationStatus,
    industry: searchParams.get("industry") ?? defaultFilters.industry,
    companySize: searchParams.get("companySize") ?? defaultFilters.companySize,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    submittedFrom:
      searchParams.get("submittedFrom") ?? defaultFilters.submittedFrom,
    submittedTo: searchParams.get("submittedTo") ?? defaultFilters.submittedTo,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
    sortBy:
      (searchParams.get("sortBy") as AdminEmployerSortBy | null) ??
      defaultFilters.sortBy,
  };
}

function getOwnerUserId(employer: PendingEmployer) {
  if (typeof employer.ownerId === "string") return employer.ownerId;
  return employer.ownerId?._id;
}

function getEmployerLabel(employer: PendingEmployer) {
  return employer.companyName ?? employer.name;
}

function getVerificationCopy(action: PendingVerificationAction) {
  if (!action) return null;

  if (action.status === "approved" || action.status === "verified") {
    return {
      title: action.status === "verified" ? "Verify company" : "Approve employer",
      confirmLabel: action.status === "verified" ? "Verify" : "Approve",
      verb: action.status === "verified" ? "verify" : "approve",
    };
  }

  return {
    title: "Update verification",
    confirmLabel: "Update",
    verb: "update verification for",
  };
}

function getAccountCopy(action: PendingAccountAction) {
  if (!action) return null;

  const labels: Record<
    AdminUserStatus | "unblock",
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    active: {
      title: "Activate employer",
      confirmLabel: "Activate",
      verb: "activate",
    },
    pending: {
      title: "Mark employer pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    suspended: {
      title: "Suspend employer",
      confirmLabel: "Suspend",
      verb: "suspend",
      destructive: true,
    },
    blocked: {
      title: "Block employer",
      confirmLabel: "Block",
      verb: "block",
      destructive: true,
    },
    unblock: {
      title: "Unblock employer",
      confirmLabel: "Unblock",
      verb: "unblock",
    },
  };

  return labels[action.status];
}

export default function PendingEmployersView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterRef = useRef<HTMLDivElement>(null);
  const [selectedEmployerIds, setSelectedEmployerIds] = useState<string[]>([]);
  const [verificationAction, setVerificationAction] =
    useState<PendingVerificationAction>(null);
  const [accountAction, setAccountAction] = useState<PendingAccountAction>(null);
  const [rejectEmployer, setRejectEmployer] = useState<PendingEmployer | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const apiFilters: PendingEmployerListParams = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      verificationStatus:
        filters.verificationStatus !== "all"
          ? filters.verificationStatus === "pending_verification"
            ? "pending"
            : filters.verificationStatus
          : undefined,
      accountStatus:
        filters.accountStatus !== "all" ? filters.accountStatus : undefined,
      industry: filters.industry.trim() || undefined,
      companySize: filters.companySize.trim() || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      submittedFrom: filters.submittedFrom || undefined,
      submittedTo: filters.submittedTo || undefined,
      page: filters.page,
      limit: filters.limit,
      sortBy: sortMap[filters.sortBy],
    }),
    [filters],
  );

  const pendingEmployersQuery = usePendingEmployers(apiFilters);
  const { verificationMutation, rejectionMutation, accountStatusMutation } =
    usePendingEmployerMutations();
  const verificationCopy = getVerificationCopy(verificationAction);
  const accountCopy = getAccountCopy(accountAction);
  const employers = pendingEmployersQuery.data?.employers ?? [];

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

  function updateFilter<Key extends keyof PendingEmployerFilterValues>(
    key: Key,
    value: PendingEmployerFilterValues[Key],
  ) {
    setSelectedEmployerIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedEmployerIds([]);
    router.replace(pathname, { scroll: false });
  }

  function confirmVerificationAction() {
    if (!verificationAction) return;

    verificationMutation.mutate(
      {
        targetEmployerId: verificationAction.employer._id,
        verificationStatus: verificationAction.status,
      },
      {
        onSuccess: () => {
          setVerificationAction(null);
          setFeedbackMessage("Employer verification updated successfully.");
          setActionError("");
          appToast.success("Employer verification updated successfully.");
        },
        onError: (error) => {
          const message =
            getApiErrorMessage(error) || "Unable to update employer verification.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function confirmAccountAction() {
    if (!accountAction) return;

    const ownerUserId = getOwnerUserId(accountAction.employer);

    if (!ownerUserId) {
      const message = "Unable to update employer account without an owner user.";
      setActionError(message);
      appToast.error(message);
      setAccountAction(null);
      return;
    }

    accountStatusMutation.mutate(
      {
        ownerUserId,
        status: accountAction.status === "unblock" ? "active" : accountAction.status,
      },
      {
        onSuccess: () => {
          setAccountAction(null);
          setFeedbackMessage("Employer account status updated successfully.");
          setActionError("");
          appToast.success("Employer account status updated successfully.");
        },
        onError: (error) => {
          const message =
            getApiErrorMessage(error) || "Unable to update employer account.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function submitRejection(payload: RejectEmployerPayload) {
    if (!rejectEmployer) return;

    rejectionMutation.mutate(
      {
        targetEmployerId: rejectEmployer._id,
        payload,
      },
      {
        onSuccess: () => {
          setRejectEmployer(null);
          setFeedbackMessage("Employer rejected successfully.");
          setActionError("");
          appToast.success("Employer rejected successfully.");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error) || "Unable to reject employer.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  const showEmptyState =
    !pendingEmployersQuery.isLoading &&
    !pendingEmployersQuery.isError &&
    employers.length === 0;

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav className="text-sm font-medium text-muted" aria-label="Breadcrumb">
            <Link href="/admin/employers" className="hover:text-primary">
              Employers
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-primary">Pending Moderation</span>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Employer Verification Queue
          </h1>
          <p className="mt-1 text-sm text-muted">
            Reviewing pending employer accounts requiring manual authorization.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              filterRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            leftIcon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
          >
            Filter List
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled
            title="CSV export will be enabled when the export endpoint is available."
            leftIcon={<Download className="size-4" aria-hidden="true" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <PendingEmployerStatsCards
        stats={pendingEmployersQuery.data?.stats}
        loading={pendingEmployersQuery.isLoading}
      />

      <div ref={filterRef}>
        <PendingEmployerFiltersPanel
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />
      </div>

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

      {pendingEmployersQuery.isError ? (
        <ErrorState
          title="Unable to load pending employers"
          message="Pending employer accounts could not be loaded. Please try again."
          onRetry={() => pendingEmployersQuery.refetch()}
        />
      ) : showEmptyState ? (
        <EmptyState
          title="Queue is clear"
          description="There are no pending employer accounts awaiting verification right now."
          actionLabel="Refresh Queue"
          onAction={() => pendingEmployersQuery.refetch()}
        />
      ) : (
        <PendingEmployersTable
          employers={employers}
          meta={pendingEmployersQuery.data?.meta}
          loading={pendingEmployersQuery.isLoading}
          selectedEmployerIds={selectedEmployerIds}
          onPageChange={(nextPage) => {
            setSelectedEmployerIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedEmployerIds}
          onChangeAccountStatus={(employer, status) =>
            setAccountAction({ employer, status })
          }
          onChangeVerification={(employer, status) =>
            setVerificationAction({ employer, status })
          }
          onReject={setRejectEmployer}
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        Navigation: <Link className="font-medium text-primary" href="/admin/dashboard">Admin Dashboard</Link>,{" "}
        <Link className="font-medium text-primary" href="/admin/employers">Manage Employers</Link>, employer
        details, and company profile review links are connected. Bulk actions,
        CSV export, and request-info workflows are prepared for backend expansion.
      </footer>

      <PendingEmployerBulkActionsBar
        selectedCount={selectedEmployerIds.length}
        onClearSelection={() => setSelectedEmployerIds([])}
      />
      <ConfirmActionModal
        open={Boolean(verificationAction && verificationCopy)}
        title={verificationCopy?.title ?? ""}
        description={
          verificationAction && verificationCopy
            ? `This will ${verificationCopy.verb} ${getEmployerLabel(
                verificationAction.employer,
              )}.`
            : ""
        }
        confirmLabel={verificationCopy?.confirmLabel}
        destructive={false}
        isLoading={verificationMutation.isPending}
        onClose={() => setVerificationAction(null)}
        onConfirm={confirmVerificationAction}
      />
      <ConfirmActionModal
        open={Boolean(accountAction && accountCopy)}
        title={accountCopy?.title ?? ""}
        description={
          accountAction && accountCopy
            ? `This will ${accountCopy.verb} ${getEmployerLabel(
                accountAction.employer,
              )}.`
            : ""
        }
        confirmLabel={accountCopy?.confirmLabel}
        destructive={accountCopy?.destructive}
        isLoading={accountStatusMutation.isPending}
        onClose={() => setAccountAction(null)}
        onConfirm={confirmAccountAction}
      />
      <RejectEmployerModal
        employer={rejectEmployer}
        isLoading={rejectionMutation.isPending}
        onClose={() => setRejectEmployer(null)}
        onSubmit={submitRejection}
      />
    </main>
  );
}
