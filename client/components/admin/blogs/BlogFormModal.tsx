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
  adminBlogFormSchema,
  type AdminBlogFormSchemaValues,
} from "@/lib/validations/admin-blog.schema";
import type {
  AdminBlog,
  AdminBlogFeaturedStatus,
  AdminBlogFormValues,
  AdminBlogStatus,
} from "@/types/admin-blog";
import type { AdminCategory } from "@/types/admin-category";

type BlogFormModalProps = {
  open: boolean;
  blog?: AdminBlog | null;
  categories?: AdminCategory[];
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: AdminBlogFormValues) => void;
};

const statusOptions: Array<{ label: string; value: AdminBlogStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
  { label: "Archived", value: "archived" },
];

const featuredOptions: Array<{ label: string; value: AdminBlogFeaturedStatus }> = [
  { label: "Featured", value: "featured" },
  { label: "Not Featured", value: "not_featured" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogFormModal({
  open,
  blog,
  categories = [],
  isLoading = false,
  onClose,
  onSubmit,
}: BlogFormModalProps) {
  const form = useForm<AdminBlogFormSchemaValues>({
    resolver: zodResolver(adminBlogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "",
      tags: "",
      status: "draft",
      featuredStatus: "not_featured",
      seoTitle: "",
      seoDescription: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      excerpt: blog?.excerpt ?? "",
      content: blog?.content ?? "",
      featuredImage: blog?.featuredImage ?? "",
      category: blog?.category ?? "",
      tags: blog?.tags?.join(", ") ?? "",
      status: blog?.status ?? "draft",
      featuredStatus: blog?.featured ? "featured" : "not_featured",
      seoTitle: blog?.seoTitle ?? "",
      seoDescription: blog?.seoDescription ?? "",
    });
  }, [blog, form, open]);

  function submit(values: AdminBlogFormSchemaValues) {
    onSubmit({
      ...values,
      slug: values.slug?.trim() || slugify(values.title),
      excerpt: values.excerpt?.trim() || undefined,
      featuredImage: values.featuredImage?.trim() || undefined,
      category: values.category?.trim() || undefined,
      tags: values.tags?.trim() || undefined,
      seoTitle: values.seoTitle?.trim() || undefined,
      seoDescription: values.seoDescription?.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={blog?._id ? "Edit Blog Article" : "Create New Article"}
      description="Prepare editorial content, SEO metadata, and publication settings."
      className="max-w-4xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="admin-blog-form" isLoading={isLoading}>
            Save Article
          </Button>
        </>
      }
    >
      <form id="admin-blog-form" className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" error={form.formState.errors.title?.message} {...form.register("title")} />
          <Input label="Slug" helperText="Leave blank to auto-generate." error={form.formState.errors.slug?.message} {...form.register("slug")} />
        </div>
        <Textarea label="Excerpt" rows={3} error={form.formState.errors.excerpt?.message} {...form.register("excerpt")} />
        <Textarea
          label="Content"
          rows={10}
          helperText="Rich text editor integration can replace this textarea when an editor is added."
          error={form.formState.errors.content?.message}
          {...form.register("content")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Featured image" placeholder="https://..." error={form.formState.errors.featuredImage?.message} {...form.register("featuredImage")} />
          <Select label="Category" error={form.formState.errors.category?.message} {...form.register("category")}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <Input label="Tags" helperText="Separate tags with commas." error={form.formState.errors.tags?.message} {...form.register("tags")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Publication status" error={form.formState.errors.status?.message} {...form.register("status")}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select label="Featured status" error={form.formState.errors.featuredStatus?.message} {...form.register("featuredStatus")}>
            {featuredOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="SEO title" error={form.formState.errors.seoTitle?.message} {...form.register("seoTitle")} />
          <Textarea label="SEO description" rows={3} error={form.formState.errors.seoDescription?.message} {...form.register("seoDescription")} />
        </div>
      </form>
    </Modal>
  );
}
