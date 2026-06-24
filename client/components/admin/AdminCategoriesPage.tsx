"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import type { TableColumn } from "@/components/ui/Table";
import {
  adminCategorySchema,
  type AdminCategoryValues,
} from "@/lib/validations/admin.schema";
import {
  adminQueryKeys,
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/services/admin.service";
import type { AdminCategory, AdminListParams } from "@/types/admin.types";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);

  const filters: AdminListParams = {
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 10,
    sortBy: "name",
  };

  const categoriesQuery = useQuery({
    queryKey: adminQueryKeys.categories(filters),
    queryFn: () => getAdminCategories(filters),
  });

  const form = useForm<AdminCategoryValues>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues: { name: "", slug: "", icon: "", status: "active" },
  });

  const saveMutation = useMutation({
    mutationFn: (values: AdminCategoryValues) =>
      editing
        ? updateAdminCategory(editing._id, values)
        : createAdminCategory(values),
    onSuccess: async () => {
      setEditing(null);
      form.reset({ name: "", slug: "", icon: "", status: "active" });
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => deleteAdminCategory(categoryId),
    onSuccess: async () => {
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const openCreate = () => {
    setEditing({ _id: "", name: "", slug: "", icon: "", status: "active" });
    form.reset({ name: "", slug: "", icon: "", status: "active" });
  };

  const openEdit = (category: AdminCategory) => {
    setEditing(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon ?? "",
      status: category.status,
    });
  };

  const columns: Array<TableColumn<AdminCategory>> = [
    { key: "name", header: "Name", render: (item) => item.name },
    { key: "slug", header: "Slug", render: (item) => item.slug },
    {
      key: "status",
      header: "Status",
      render: (item) => <AdminStatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(item)}>
            Deactivate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted">Create and maintain job categories.</p>
        </div>
        <Button leftIcon={<Plus className="size-4" aria-hidden="true" />} onClick={openCreate}>
          New Category
        </Button>
      </div>
      <AdminFilterBar
        search={search}
        status={status}
        statusOptions={statusOptions}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        onStatusChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
      />
      {categoriesQuery.isError ? (
        <ErrorState title="Categories unavailable" message="Categories could not be loaded." />
      ) : (
        <AdminDataTable
          columns={columns}
          data={categoriesQuery.data?.categories ?? []}
          loading={categoriesQuery.isLoading}
          emptyMessage="No categories found."
          meta={categoriesQuery.data?.meta}
          onPageChange={setPage}
          getRowKey={(item) => item._id}
        />
      )}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?._id ? "Edit Category" : "New Category"}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="admin-category-form"
              isLoading={saveMutation.isPending}
            >
              Save
            </Button>
          </>
        }
      >
        <form
          id="admin-category-form"
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <Input label="Name" error={form.formState.errors.name?.message} {...form.register("name")} />
          <Input label="Slug" error={form.formState.errors.slug?.message} {...form.register("slug")} />
          <Input label="Icon" error={form.formState.errors.icon?.message} {...form.register("icon")} />
          <Select label="Status" {...form.register("status")}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </form>
      </Modal>
      <ConfirmActionModal
        open={Boolean(deleting)}
        title="Deactivate category"
        description={`Deactivate ${deleting?.name ?? "this category"}.`}
        confirmLabel="Deactivate"
        destructive
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting._id)}
      />
    </main>
  );
}
