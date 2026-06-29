"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Filter, Plus } from "lucide-react";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import CompanyBulkActionsBar from "@/components/admin/companies/CompanyBulkActionsBar";
import CompanyFilters from "@/components/admin/companies/CompanyFilters";
import CompanyStatsCards from "@/components/admin/companies/CompanyStatsCards";
import CompaniesTable from "@/components/admin/companies/CompaniesTable";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import {
  useAdminCompanies,
  useAdminCompanyMutations,
  useAdminCompanyStats,
} from "@/hooks/admin/useAdminCompanies";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  AdminCompany,
  AdminCompanyFilters,
  AdminCompanyListParams,
  AdminCompanySortBy,
  AdminCompanyStatus,
  AdminCompanyVerificationStatus,
} from "@/types/admin-company.types";

type RequiredFilters = Required<AdminCompanyFilters>;

type PendingVerificationAction = {
  company: AdminCompany;
  status: AdminCompanyVerificationStatus;
} | null;

type PendingStatusAction = {
  company: AdminCompany;
  status: AdminCompanyStatus | "unblock";
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  verificationStatus: "all",
  companyStatus: "all",
  industry: "",
  companySize: "",
  dateFrom: "",
  dateTo: "",
  page: 1,
  limit: 10,
  sortBy: "newest",
};

const sortMap: Record<AdminCompanySortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  company_name_asc: "name",
  company_name_desc: "-name",
  recently_updated: "-updatedAt",
  most_active: "-activeJobsCount",
};

function toApiVerificationStatus(status: AdminCompanyVerificationStatus) {
  if (status === "verified") return "approved";
  if (
    status === "pending_verification" ||
    status === "under_review" ||
    status === "unverified"
  ) {
    return "pending";
  }

  return status;
}

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    verificationStatus:
      (searchParams.get(
        "verificationStatus",
      ) as AdminCompanyVerificationStatus | "all" | null) ??
      defaultFilters.verificationStatus,
    companyStatus:
      (searchParams.get("companyStatus") as AdminCompanyStatus | "all" | null) ??
      defaultFilters.companyStatus,
    industry: searchParams.get("industry") ?? defaultFilters.industry,
    companySize: searchParams.get("companySize") ?? defaultFilters.companySize,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
    sortBy:
      (searchParams.get("sortBy") as AdminCompanySortBy | null) ??
      defaultFilters.sortBy,
  };
}

function getVerificationCopy(action: PendingVerificationAction) {
  if (!action) return null;

  const labels: Record<
    AdminCompanyVerificationStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    verified: {
      title: "Verify company",
      confirmLabel: "Verify",
      verb: "verify",
    },
    approved: {
      title: "Approve company",
      confirmLabel: "Approve",
      verb: "approve",
    },
    pending_verification: {
      title: "Mark company pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    under_review: {
      title: "Mark company under review",
      confirmLabel: "Mark under review",
      verb: "mark under review",
    },
    pending: {
      title: "Mark company pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    unverified: {
      title: "Mark company unverified",
      confirmLabel: "Mark unverified",
      verb: "mark unverified",
    },
    rejected: {
      title: "Reject company verification",
      confirmLabel: "Reject",
      verb: "reject",
      destructive: true,
    },
    blocked: {
      title: "Block company verification",
      confirmLabel: "Block",
      verb: "block",
      destructive: true,
    },
  };

  return labels[action.status];
}

function getStatusCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    AdminCompanyStatus | "unblock",
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    active: {
      title: "Activate company",
      confirmLabel: "Activate",
      verb: "activate",
    },
    pending: {
      title: "Mark company pending",
      confirmLabel: "Mark pending",
      verb: "mark pending",
    },
    suspended: {
      title: "Suspend company",
      confirmLabel: "Suspend",
      verb: "suspend",
      destructive: true,
    },
    blocked: {
      title: "Block company",
      confirmLabel: "Block",
      verb: "block",
      destructive: true,
    },
    unblock: {
      title: "Unblock company",
      confirmLabel: "Unblock",
      verb: "unblock",
    },
  };

  return labels[action.status];
}

function getCompanyLabel(company: AdminCompany) {
  return company.companyName ?? company.name;
}

export default function ManageCompaniesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [verificationAction, setVerificationAction] =
    useState<PendingVerificationAction>(null);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const apiFilters: AdminCompanyListParams = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      verificationStatus:
        filters.verificationStatus !== "all"
          ? toApiVerificationStatus(filters.verificationStatus)
          : undefined,
      companyStatus:
        filters.companyStatus !== "all" ? filters.companyStatus : undefined,
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

  const companiesQuery = useAdminCompanies(apiFilters);
  const statsQuery = useAdminCompanyStats();
  const { verificationMutation, statusMutation } = useAdminCompanyMutations();
  const verificationCopy = getVerificationCopy(verificationAction);
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

  function updateFilter<Key extends keyof AdminCompanyFilters>(
    key: Key,
    value: AdminCompanyFilters[Key],
  ) {
    setSelectedCompanyIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedCompanyIds([]);
    router.replace(pathname, { scroll: false });
  }

  function confirmVerificationAction() {
    if (!verificationAction) return;

    verificationMutation.mutate(
      {
        targetCompanyId: verificationAction.company._id,
        verificationStatus: verificationAction.status,
      },
      {
        onSuccess: () => {
          setVerificationAction(null);
          setFeedbackMessage("Company verification updated successfully.");
          setActionError("");
          appToast.success("Company verification updated successfully.");
        },
        onError: (error) => {
          const message =
            getApiErrorMessage(error) || "Unable to update company verification.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    statusMutation.mutate(
      {
        targetCompanyId: statusAction.company._id,
        status: statusAction.status === "unblock" ? "active" : statusAction.status,
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Company status updated successfully.");
          setActionError("");
          appToast.success("Company status updated successfully.");
        },
        onError: (error) => {
          const message =
            getApiErrorMessage(error) || "Unable to update company status.";
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
            Manage Companies
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review, verify, and monitor employer profiles across the platform.
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
            title="Company onboarding will be enabled when the create-company endpoint is available."
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
          >
            Onboard New
          </Button>
        </div>
      </div>

      <CompanyStatsCards stats={statsQuery.data} loading={statsQuery.isLoading} />

      <CompanyFilters
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

      {companiesQuery.isError ? (
        <ErrorState
          title="Unable to load companies"
          message="Company profiles could not be loaded. Please try again."
          onRetry={() => companiesQuery.refetch()}
        />
      ) : (
        <CompaniesTable
          companies={companiesQuery.data?.companies ?? []}
          meta={companiesQuery.data?.meta}
          loading={companiesQuery.isLoading}
          selectedCompanyIds={selectedCompanyIds}
          onPageChange={(nextPage) => {
            setSelectedCompanyIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedCompanyIds}
          onChangeStatus={(company, status) => setStatusAction({ company, status })}
          onChangeVerification={(company, status) =>
            setVerificationAction({ company, status })
          }
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: company listing, review, verification, status moderation,
        search, sorting, and pagination are connected. Bulk actions, export,
        onboarding, dedicated company analytics, and advanced review workflows
        are prepared for backend expansion.
      </footer>

      <CompanyBulkActionsBar
        selectedCount={selectedCompanyIds.length}
        onClearSelection={() => setSelectedCompanyIds([])}
      />
      <ConfirmActionModal
        open={Boolean(verificationAction && verificationCopy)}
        title={verificationCopy?.title ?? ""}
        description={
          verificationAction && verificationCopy
            ? `This will ${verificationCopy.verb} ${getCompanyLabel(
                verificationAction.company,
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
        open={Boolean(statusAction && statusCopy)}
        title={statusCopy?.title ?? ""}
        description={
          statusAction && statusCopy
            ? `This will ${statusCopy.verb} ${getCompanyLabel(
                statusAction.company,
              )}.`
            : ""
        }
        confirmLabel={statusCopy?.confirmLabel}
        destructive={statusCopy?.destructive}
        isLoading={statusMutation.isPending}
        onClose={() => setStatusAction(null)}
        onConfirm={confirmStatusAction}
      />
    </main>
  );
}
