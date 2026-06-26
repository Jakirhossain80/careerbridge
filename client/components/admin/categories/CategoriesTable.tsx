"use client";

import Link from "next/link";
import { Eye, FolderTree } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import CategoryRowActions from "@/components/admin/categories/CategoryRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type { AdminCategory, AdminCategoryStatus } from "@/types/admin-category";
import type { AdminMeta } from "@/types/admin.types";

type CategoriesTableProps = {
  categories: AdminCategory[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedCategoryIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (categoryIds: string[]) => void;
  onEdit: (category: AdminCategory) => void;
  onChangeStatus: (category: AdminCategory, status: AdminCategoryStatus) => void;
  onDelete: (category: AdminCategory) => void;
};

function formatDate(value?: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getIconLabel(category: AdminCategory) {
  return category.icon?.trim().slice(0, 2).toUpperCase() || category.name.slice(0, 2).toUpperCase();
}

export default function CategoriesTable({
  categories,
  meta,
  loading = false,
  selectedCategoryIds,
  onPageChange,
  onSelectionChange,
  onEdit,
  onChangeStatus,
  onDelete,
}: CategoriesTableProps) {
  const selectableIds = categories.map((category) => category._id);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedCategoryIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(
        selectedCategoryIds.filter((id) => !selectableIds.includes(id)),
      );
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedCategoryIds, ...selectableIds])));
  }

  function toggleCategory(categoryId: string) {
    if (selectedCategoryIds.includes(categoryId)) {
      onSelectionChange(selectedCategoryIds.filter((id) => id !== categoryId));
      return;
    }

    onSelectionChange([...selectedCategoryIds, categoryId]);
  }

  const columns: Array<TableColumn<AdminCategory>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible categories"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (category) => (
        <input
          type="checkbox"
          checked={selectedCategoryIds.includes(category._id)}
          onChange={() => toggleCategory(category._id)}
          aria-label={`Select ${category.name}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "category",
      header: "Category",
      render: (category) => (
        <div className="flex min-w-72 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-primary ring-1 ring-blue-100">
            {category.icon ? (
              getIconLabel(category)
            ) : (
              <FolderTree className="size-4" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/categories/${category.slug}`}
              className="font-semibold text-slate-950 hover:text-primary"
            >
              {category.name}
            </Link>
            <p className="mt-0.5 max-w-64 truncate text-xs text-slate-500">
              /{category.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (category) => (
        <span className="block max-w-80 truncate">
          {category.description ?? "Description not configured"}
        </span>
      ),
    },
    {
      key: "totalJobs",
      header: "Total Jobs",
      render: (category) => (category.jobsCount ?? 0).toLocaleString(),
    },
    {
      key: "activeJobs",
      header: "Active Jobs",
      render: (category) => (
        <span className="font-semibold text-slate-900">
          {(category.activeJobsCount ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (category) => <AdminStatusBadge status={category.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (category) => formatDate(category.createdAt),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (category) => formatDate(category.updatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/categories/${category.slug}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${category.name}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <CategoryRowActions
            category={category}
            onEdit={onEdit}
            onChangeStatus={onChangeStatus}
            onDelete={onDelete}
          />
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={categories}
      loading={loading}
      emptyMessage="No categories found. Try adjusting your filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(category) => category._id}
    />
  );
}
