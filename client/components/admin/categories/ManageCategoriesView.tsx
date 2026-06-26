"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import CategoryBulkActionsBar from "@/components/admin/categories/CategoryBulkActionsBar";
import CategoryFilters from "@/components/admin/categories/CategoryFilters";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import CategoryStatsCards from "@/components/admin/categories/CategoryStatsCards";
import CategoriesTable from "@/components/admin/categories/CategoriesTable";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import {
  useAdminCategories,
  useAdminCategoryMutations,
  useAdminCategoryStats,
} from "@/hooks/admin/useAdminCategories";
import { getApiErrorMessage } from "@/lib/api";
import type {
  AdminCategory,
  AdminCategoryFilters,
  AdminCategoryFormValues,
  AdminCategoryListParams,
  AdminCategorySortBy,
  AdminCategoryStatus,
} from "@/types/admin-category";

type RequiredFilters = Required<AdminCategoryFilters>;

type PendingStatusAction = {
  category: AdminCategory;
  status: AdminCategoryStatus;
} | null;

type PendingDeleteAction = {
  category: AdminCategory;
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  status: "all",
  dateFrom: "",
  dateTo: "",
  updatedFrom: "",
  updatedTo: "",
  sortBy: "newest",
  page: 1,
  limit: 10,
};

const sortMap: Record<AdminCategorySortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  name_asc: "name",
  name_desc: "-name",
  most_jobs: "-updatedAt",
  least_jobs: "updatedAt",
};

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    status:
      (searchParams.get("status") as AdminCategoryStatus | "all" | null) ??
      defaultFilters.status,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    updatedFrom: searchParams.get("updatedFrom") ?? defaultFilters.updatedFrom,
    updatedTo: searchParams.get("updatedTo") ?? defaultFilters.updatedTo,
    sortBy:
      (searchParams.get("sortBy") as AdminCategorySortBy | null) ??
      defaultFilters.sortBy,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
  };
}

function getStatusCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    AdminCategoryStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    active: { title: "Activate category", confirmLabel: "Activate", verb: "activate" },
    inactive: {
      title: "Deactivate category",
      confirmLabel: "Deactivate",
      verb: "deactivate",
      destructive: true,
    },
    archived: {
      title: "Archive category",
      confirmLabel: "Archive",
      verb: "archive",
      destructive: true,
    },
    approved: { title: "Approve category", confirmLabel: "Approve", verb: "approve" },
    flagged: {
      title: "Flag category",
      confirmLabel: "Flag",
      verb: "flag",
      destructive: true,
    },
  };

  return labels[action.status];
}

function applyClientFilters(categories: AdminCategory[], filters: RequiredFilters) {
  let nextCategories = categories;

  if (filters.updatedFrom) {
    const from = new Date(filters.updatedFrom).getTime();
    nextCategories = nextCategories.filter(
      (category) => category.updatedAt && new Date(category.updatedAt).getTime() >= from,
    );
  }

  if (filters.updatedTo) {
    const toDate = new Date(filters.updatedTo);
    toDate.setHours(23, 59, 59, 999);
    nextCategories = nextCategories.filter(
      (category) =>
        category.updatedAt && new Date(category.updatedAt).getTime() <= toDate.getTime(),
    );
  }

  return nextCategories;
}

export default function ManageCategoriesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [formCategory, setFormCategory] = useState<AdminCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [deleteAction, setDeleteAction] = useState<PendingDeleteAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const apiFilters: AdminCategoryListParams = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      status:
        filters.status !== "all"
          ? filters.status === "active"
            ? "active"
            : "inactive"
          : undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      sortBy: sortMap[filters.sortBy],
      page: filters.page,
      limit: filters.limit,
    }),
    [filters],
  );

  const categoriesQuery = useAdminCategories(apiFilters);
  const statsQuery = useAdminCategoryStats();
  const {
    createMutation,
    deleteMutation,
    statusMutation,
    updateMutation,
  } = useAdminCategoryMutations();
  const statusCopy = getStatusCopy(statusAction);
  const categories = useMemo(
    () => applyClientFilters(categoriesQuery.data?.categories ?? [], filters),
    [categoriesQuery.data?.categories, filters],
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

  function updateFilter<Key extends keyof AdminCategoryFilters>(
    key: Key,
    value: AdminCategoryFilters[Key],
  ) {
    setSelectedCategoryIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedCategoryIds([]);
    router.replace(pathname, { scroll: false });
  }

  function openCreate() {
    setFormCategory(null);
    setFormOpen(true);
  }

  function openEdit(category: AdminCategory) {
    setFormCategory(category);
    setFormOpen(true);
  }

  function submitCategory(values: AdminCategoryFormValues) {
    const mutation = formCategory?._id ? updateMutation : createMutation;
    const payload = formCategory?._id
      ? { categoryId: formCategory._id, values }
      : values;

    if (formCategory?._id) {
      updateMutation.mutate(payload as { categoryId: string; values: AdminCategoryFormValues }, {
        onSuccess: () => {
          setFormOpen(false);
          setFormCategory(null);
          setFeedbackMessage("Category updated successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error) || "Unable to update category.");
        },
      });
      return;
    }

    createMutation.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
        setFeedbackMessage("Category created successfully.");
        setActionError("");
      },
      onError: (error) => {
        setActionError(getApiErrorMessage(error) || "Unable to create category.");
      },
    });

    void mutation;
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    statusMutation.mutate(
      {
        categoryId: statusAction.category._id,
        status: statusAction.status,
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Category status updated successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error) || "Unable to update category status.");
        },
      },
    );
  }

  function confirmDeleteAction() {
    if (!deleteAction) return;

    deleteMutation.mutate(
      { categoryId: deleteAction.category._id },
      {
        onSuccess: () => {
          setDeleteAction(null);
          setFeedbackMessage("Category deactivated successfully.");
          setActionError("");
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error) || "Unable to delete category.");
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
            Job Categories
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage systemic taxonomy and global industry classifications.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          leftIcon={<Plus className="size-4" aria-hidden="true" />}
        >
          Add New Category
        </Button>
      </div>

      <CategoryStatsCards stats={statsQuery.data} loading={statsQuery.isLoading} />

      <CategoryFilters
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

      {categoriesQuery.isError ? (
        <ErrorState
          title="Unable to load categories"
          message="Categories could not be loaded. Please try again."
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : (
        <CategoriesTable
          categories={categories}
          meta={categoriesQuery.data?.meta}
          loading={categoriesQuery.isLoading}
          selectedCategoryIds={selectedCategoryIds}
          onPageChange={(nextPage) => {
            setSelectedCategoryIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedCategoryIds}
          onEdit={openEdit}
          onChangeStatus={(category, status) => setStatusAction({ category, status })}
          onDelete={(category) => setDeleteAction({ category })}
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: category list, create, edit, activate, deactivate,
        delete-as-deactivate, search, filtering, sorting, and pagination are
        connected. Description, archived/approved/flagged statuses, job counts,
        bulk actions, and public category job APIs are prepared for backend
        expansion.
      </footer>

      <CategoryBulkActionsBar
        selectedCount={selectedCategoryIds.length}
        onClearSelection={() => setSelectedCategoryIds([])}
      />
      <CategoryFormModal
        open={formOpen}
        category={formCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setFormOpen(false);
          setFormCategory(null);
        }}
        onSubmit={submitCategory}
      />
      <ConfirmActionModal
        open={Boolean(statusAction && statusCopy)}
        title={statusCopy?.title ?? ""}
        description={
          statusAction && statusCopy
            ? `This will ${statusCopy.verb} ${statusAction.category.name}.`
            : ""
        }
        confirmLabel={statusCopy?.confirmLabel}
        destructive={statusCopy?.destructive}
        isLoading={statusMutation.isPending}
        onClose={() => setStatusAction(null)}
        onConfirm={confirmStatusAction}
      />
      <ConfirmActionModal
        open={Boolean(deleteAction)}
        title="Delete category"
        description={
          deleteAction
            ? `The current backend deactivates ${deleteAction.category.name} instead of hard deleting it.`
            : ""
        }
        confirmLabel="Deactivate"
        destructive
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteAction(null)}
        onConfirm={confirmDeleteAction}
      />
    </main>
  );
}
