"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, UserPlus } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import EmployerBulkActionsBar from "@/components/admin/employers/EmployerBulkActionsBar";
import EmployerFilters from "@/components/admin/employers/EmployerFilters";
import EmployerStatsCards from "@/components/admin/employers/EmployerStatsCards";
import EmployersTable from "@/components/admin/employers/EmployersTable";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import {
  useAdminEmployerMutations,
  useAdminEmployers,
  useAdminEmployerStats,
} from "@/hooks/admin/useAdminEmployers";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  AdminEmployer,
  AdminEmployerAccountStatus,
  AdminEmployerFilters,
  AdminEmployerListParams,
  AdminEmployerSortBy,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";

type RequiredFilters = Required<AdminEmployerFilters>;

type PendingVerificationAction = {
  employer: AdminEmployer;
  status: AdminEmployerVerificationStatus;
} | null;

type PendingAccountAction = {
  employer: AdminEmployer;
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

function toApiVerificationStatus(status: AdminEmployerVerificationStatus) {
  if (status === "verified") return "approved";
  if (status === "pending_verification" || status === "unverified") {
    return "pending";
  }

  return status;
}

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
      ) as AdminEmployerVerificationStatus | "all" | null) ??
      defaultFilters.verificationStatus,
    industry: searchParams.get("industry") ?? defaultFilters.industry,
    companySize: searchParams.get("companySize") ?? defaultFilters.companySize,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
    sortBy:
      (searchParams.get("sortBy") as AdminEmployerSortBy | null) ??
      defaultFilters.sortBy,
  };
}

function getVerificationCopy(action: PendingVerificationAction) {
  if (!action) return null;

  const labels: Record<
    AdminEmployerVerificationStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    verified: {
      title: "Verify employer",
      confirmLabel: "Verify",
      verb: "verify",
    },
    approved: {
      title: "Approve employer",
      confirmLabel: "Approve",
      verb: "approve",
    },
    pending_verification: {
      title: "Mark employer pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    pending: {
      title: "Mark employer pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    unverified: {
      title: "Mark employer unverified",
      confirmLabel: "Mark unverified",
      verb: "mark unverified",
    },
    rejected: {
      title: "Reject employer verification",
      confirmLabel: "Reject",
      verb: "reject",
      destructive: true,
    },
    blocked: {
      title: "Block employer verification",
      confirmLabel: "Block",
      verb: "block",
      destructive: true,
    },
  };

  return labels[action.status];
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

function getEmployerLabel(employer: AdminEmployer) {
  return employer.companyName ?? employer.name;
}

function getOwnerUserId(employer: AdminEmployer) {
  if (typeof employer.ownerId === "string") return employer.ownerId;
  return employer.ownerId?._id;
}

export default function ManageEmployersView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedEmployerIds, setSelectedEmployerIds] = useState<string[]>([]);
  const [verificationAction, setVerificationAction] =
    useState<PendingVerificationAction>(null);
  const [accountAction, setAccountAction] = useState<PendingAccountAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const apiFilters: AdminEmployerListParams = useMemo(
    () => ({
      search:
        [filters.search, filters.industry, filters.companySize]
          .map((value) => value.trim())
          .filter(Boolean)
          .join(" ") || undefined,
      status:
        filters.verificationStatus !== "all"
          ? toApiVerificationStatus(filters.verificationStatus)
          : undefined,
      accountStatus:
        filters.accountStatus !== "all" ? filters.accountStatus : undefined,
      industry: filters.industry.trim() || undefined,
      companySize: filters.companySize.trim() || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      page: filters.page,
      limit: filters.limit,
      sortBy: sortMap[filters.sortBy],
    }),
    [filters],
  );

  const employersQuery = useAdminEmployers(apiFilters);
  const statsQuery = useAdminEmployerStats();
  const { verificationMutation, accountStatusMutation } =
    useAdminEmployerMutations();
  const verificationCopy = getVerificationCopy(verificationAction);
  const accountCopy = getAccountCopy(accountAction);

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

  function updateFilter<Key extends keyof AdminEmployerFilters>(
    key: Key,
    value: AdminEmployerFilters[Key],
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

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Employers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage partner organizations and recruiter permissions.
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
            Export List
          </Button>
          <Button
            type="button"
            disabled
            title="Adding employers will be enabled when the create-employer endpoint is available."
            leftIcon={<UserPlus className="size-4" aria-hidden="true" />}
          >
            Add Employer
          </Button>
        </div>
      </div>

      <EmployerStatsCards stats={statsQuery.data} loading={statsQuery.isLoading} />

      <EmployerFilters
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

      {employersQuery.isError ? (
        <ErrorState
          title="Unable to load employers"
          message="Employer accounts could not be loaded. Please try again."
          onRetry={() => employersQuery.refetch()}
        />
      ) : (
        <EmployersTable
          employers={employersQuery.data?.employers ?? []}
          meta={employersQuery.data?.meta}
          loading={employersQuery.isLoading}
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
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: employer list, verification moderation, account status
        updates, search, sorting, and pagination are connected. Bulk actions,
        export, dedicated employer analytics, and advanced backend filters are
        prepared for backend expansion.
      </footer>

      <EmployerBulkActionsBar
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
        destructive={verificationCopy?.destructive}
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
    </main>
  );
}
