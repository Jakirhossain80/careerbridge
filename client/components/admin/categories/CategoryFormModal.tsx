"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import {
  adminCategoryFormSchema,
  type AdminCategoryFormSchemaValues,
} from "@/lib/validations/admin-category.schema";
import type {
  AdminCategory,
  AdminCategoryFormValues,
  AdminCategoryStatus,
} from "@/types/admin-category";

type CategoryFormModalProps = {
  open: boolean;
  category?: AdminCategory | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: AdminCategoryFormValues) => void;
};

const statusOptions: Array<{ label: string; value: AdminCategoryStatus; disabled?: boolean }> = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived", disabled: true },
  { label: "Approved", value: "approved", disabled: true },
  { label: "Flagged", value: "flagged", disabled: true },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryFormModal({
  open,
  category,
  isLoading = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const form = useForm<AdminCategoryFormSchemaValues>({
    resolver: zodResolver(adminCategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
      status:
        category?.status === "active" || category?.status === "inactive"
          ? category.status
          : "active",
    });
  }, [category, form, open]);

  function submit(values: AdminCategoryFormSchemaValues) {
    onSubmit({
      ...values,
      slug: values.slug?.trim() || slugify(values.name),
      description: values.description?.trim() || undefined,
      icon: values.icon?.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category?._id ? "Edit Category" : "Add New Category"}
      description="Manage taxonomy labels used across job discovery."
      className="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="admin-category-form"
            isLoading={isLoading}
          >
            Save Category
          </Button>
        </>
      }
    >
      <form
        id="admin-category-form"
        className="grid gap-4"
        onSubmit={form.handleSubmit(submit)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Category name"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
          <Input
            label="Slug"
            helperText="Leave blank to auto-generate from the category name."
            error={form.formState.errors.slug?.message}
            {...form.register("slug")}
          />
        </div>
        <Textarea
          label="Description"
          error={form.formState.errors.description?.message}
          {...form.register("description")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Icon"
            placeholder="briefcase"
            error={form.formState.errors.icon?.message}
            {...form.register("icon")}
          />
          <Select
            label="Status"
            error={form.formState.errors.status?.message}
            {...form.register("status")}
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </form>
    </Modal>
  );
}
