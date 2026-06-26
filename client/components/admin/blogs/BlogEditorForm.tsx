"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarClock,
  Eye,
  ImageIcon,
  Link2,
  Save,
  Send,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAdminBlogMutations } from "@/hooks/admin/useAdminBlogs";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { getApiErrorMessage } from "@/lib/api";
import {
  adminBlogEditorSchema,
  type AdminBlogEditorValues,
} from "@/lib/validations/admin-blog.schema";
import type { AdminBlogFormValues, AdminBlogStatus } from "@/types/admin-blog";

const defaultValues: AdminBlogEditorValues = {
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
};

const statusOptions: Array<{ label: string; value: Exclude<AdminBlogStatus, "archived"> }> = [
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

function getCounterTone(value: number, limit: number) {
  if (value > limit) return "text-red-600";
  if (value > limit * 0.9) return "text-amber-700";
  return "text-muted";
}

function toBlogValues(values: AdminBlogEditorValues): AdminBlogFormValues {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt?.trim() || undefined,
    content: values.content,
    featuredImage: values.featuredImage?.trim() || undefined,
    category: values.category,
    tags: values.tags?.trim() || undefined,
    status: values.status,
    featuredStatus: values.featuredStatus,
    seoTitle: values.seoTitle?.trim() || undefined,
    seoDescription: values.seoDescription?.trim() || undefined,
  };
}

export default function BlogEditorForm() {
  const router = useRouter();
  const [actionError, setActionError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [localImagePreview, setLocalImagePreview] = useState("");
  const lastGeneratedSlug = useRef("");

  const categoriesQuery = useAdminCategories({
    page: 1,
    limit: 100,
    sortBy: "name",
  });
  const { createMutation } = useAdminBlogMutations();

  const form = useForm<AdminBlogEditorValues>({
    resolver: zodResolver(adminBlogEditorSchema),
    defaultValues,
    mode: "onBlur",
  });

  const previewValues = useWatch({ control: form.control }) as AdminBlogEditorValues;
  const title = previewValues.title ?? "";
  const slug = previewValues.slug ?? "";
  const content = previewValues.content ?? "";
  const featuredImage = previewValues.featuredImage ?? "";
  const seoTitle = previewValues.seoTitle ?? "";
  const seoDescription = previewValues.seoDescription ?? "";
  const status = previewValues.status ?? "draft";
  const featuredStatus = previewValues.featuredStatus ?? "not_featured";
  const readingTime = useMemo(() => estimateReadingTime(content), [content]);
  const tagList = useMemo(
    () =>
      (previewValues.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [previewValues.tags],
  );
  const imagePreview = featuredImage || localImagePreview;

  useEffect(() => {
    const nextSlug = slugify(title);

    if (!nextSlug) return;

    if (!slug || slug === lastGeneratedSlug.current) {
      form.setValue("slug", nextSlug, {
        shouldDirty: true,
        shouldValidate: form.formState.touchedFields.slug,
      });
      lastGeneratedSlug.current = nextSlug;
    }
  }, [form, slug, title]);

  useEffect(() => {
    return () => {
      if (localImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(localImagePreview);
      }
    };
  }, [localImagePreview]);

  function createBlog(values: AdminBlogEditorValues, successMessage: string) {
    setActionError("");
    setFeedbackMessage("");

    createMutation.mutate(toBlogValues(values), {
      onSuccess: (blog) => {
        setFeedbackMessage(successMessage);
        router.push(`/admin/blogs/${blog._id}/edit`);
      },
      onError: (error) => {
        setActionError(getApiErrorMessage(error) || "Unable to create blog article.");
      },
    });
  }

  function submitWithStatus(nextStatus: Exclude<AdminBlogStatus, "archived">) {
    form.setValue("status", nextStatus, { shouldDirty: true, shouldValidate: true });
    void form.handleSubmit((values) => {
      createBlog(
        { ...values, status: nextStatus },
        nextStatus === "published"
          ? "Blog article published successfully."
          : "Blog draft saved successfully.",
      );
    })();
  }

  async function openPreview() {
    const valid = await form.trigger(["title", "slug", "content"]);
    if (valid) {
      setPreviewOpen(true);
    }
  }

  function handleCancel() {
    if (form.formState.isDirty) {
      setCancelOpen(true);
      return;
    }

    router.push("/admin/blogs");
  }

  function confirmCancel() {
    setCancelOpen(false);
    router.push("/admin/blogs");
  }

  function handleImageFile(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      form.setError("featuredImage", { message: "Upload an image file." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      form.setError("featuredImage", { message: "Image preview files must be 2MB or less." });
      return;
    }

    if (localImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(localImagePreview);
    }

    setLocalImagePreview(URL.createObjectURL(file));
    form.clearErrors("featuredImage");
  }

  function removeFeaturedImage() {
    if (localImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(localImagePreview);
    }
    setLocalImagePreview("");
    form.setValue("featuredImage", "", { shouldDirty: true, shouldValidate: true });
  }

  return (
    <main className="p-4 pb-24 sm:p-6 sm:pb-24">
      <form
        className="mx-auto flex w-full max-w-7xl flex-col gap-5"
        onSubmit={form.handleSubmit((values) => createBlog(values, "Blog article created successfully."))}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <nav className="flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
              <Link href="/admin/dashboard" className="font-medium text-primary hover:text-blue-700">
                Admin Console
              </Link>
              <span>/</span>
              <Link href="/admin/blogs" className="font-medium text-primary hover:text-blue-700">
                Blogs
              </Link>
              <span>/</span>
              <span>New Article</span>
            </nav>
            <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
              Add Blog Post
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Create editorial content, prepare metadata, and choose how this article appears across CareerBridge.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={openPreview}
              leftIcon={<Eye className="size-4" aria-hidden="true" />}
            >
              Preview
            </Button>
            <Button
              type="button"
              variant="secondary"
              isLoading={createMutation.isPending && form.getValues("status") === "draft"}
              onClick={() => submitWithStatus("draft")}
              leftIcon={<Save className="size-4" aria-hidden="true" />}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              isLoading={createMutation.isPending && form.getValues("status") === "published"}
              onClick={() => submitWithStatus("published")}
              leftIcon={<Send className="size-4" aria-hidden="true" />}
            >
              Publish Now
            </Button>
          </div>
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

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card
              className="shadow-sm"
              contentClassName="space-y-5"
              header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Editor</h2>
                    <p className="mt-1 text-sm text-muted">Draft the article body and primary search fields.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900">
                    <Button type="button" variant="ghost" size="sm" className="size-9 p-0" title="Bold">
                      B
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="size-9 p-0 italic" title="Italic">
                      I
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-9 p-0"
                      title="Insert link"
                    >
                      <Link2 className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-9 p-0"
                      title="Rich text editor integration point"
                    >
                      <Sparkles className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              }
            >
              <Input
                label="Title"
                placeholder="Write a useful, searchable article title"
                required
                error={form.formState.errors.title?.message}
                {...form.register("title")}
              />
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <Input
                  label="Slug"
                  required
                  helperText="Auto-generated from the title. You can edit it before publishing."
                  error={form.formState.errors.slug?.message}
                  {...form.register("slug")}
                />
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase text-muted">Reading time</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{readingTime} min</p>
                </div>
              </div>
              <Textarea
                label="Excerpt"
                rows={3}
                placeholder="Summarize the post for article cards and search snippets."
                error={form.formState.errors.excerpt?.message}
                {...form.register("excerpt")}
              />
              <Textarea
                label="Content"
                rows={18}
                required
                helperText="Reusable rich text editor integration point. No new editor dependency has been added."
                placeholder="Write the article content here."
                error={form.formState.errors.content?.message}
                className="min-h-96 font-mono leading-6"
                {...form.register("content")}
              />
            </Card>

            <Card
              className="shadow-sm"
              contentClassName="space-y-4"
              header={
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Classification</h2>
                  <p className="mt-1 text-sm text-muted">Organize the article for admin filtering and public discovery.</p>
                </div>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Category"
                  required
                  disabled={categoriesQuery.isLoading}
                  error={form.formState.errors.category?.message}
                  helperText={
                    categoriesQuery.isError
                      ? "Categories could not be loaded. Retry from the browser or check the API."
                      : categoriesQuery.data?.categories.length === 0
                        ? "No categories are available yet."
                        : undefined
                  }
                  {...form.register("category")}
                >
                  <option value="">Select category</option>
                  {categoriesQuery.data?.categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Tags"
                  placeholder="Hiring, resumes, remote work"
                  helperText="Separate multiple tags with commas."
                  error={form.formState.errors.tags?.message}
                  {...form.register("tags")}
                />
              </div>
              {tagList.length ? (
                <div className="flex flex-wrap gap-2">
                  {tagList.map((tag) => (
                    <Badge key={tag} variant="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </Card>
          </div>

          <aside className="space-y-5">
            <Card
              className="shadow-sm"
              contentClassName="space-y-4"
              header={
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Status</h2>
                    <p className="mt-1 text-sm text-muted">Choose publication and visibility state.</p>
                  </div>
                  <AdminStatusBadge status={status} />
                </div>
              }
            >
              <Select
                label="Publication status"
                error={form.formState.errors.status?.message}
                {...form.register("status")}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Featured status"
                error={form.formState.errors.featuredStatus?.message}
                {...form.register("featuredStatus")}
              >
                <option value="not_featured">Not Featured</option>
                <option value="featured">Featured</option>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase text-muted">Preview</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{slug || "article-slug"}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase text-muted">Featured</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {featuredStatus === "featured" ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => submitWithStatus(status)}
                isLoading={createMutation.isPending}
                leftIcon={<CalendarClock className="size-4" aria-hidden="true" />}
              >
                Save Current Status
              </Button>
            </Card>

            <Card
              className="shadow-sm"
              contentClassName="space-y-4"
              header={
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Featured Image</h2>
                  <p className="mt-1 text-sm text-muted">Add a public image URL or use a local preview before upload integration.</p>
                </div>
              }
            >
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-muted">
                    <ImageIcon className="mx-auto size-9" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium">No image selected</p>
                  </div>
                )}
              </div>
              <Input
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                error={form.formState.errors.featuredImage?.message}
                {...form.register("featuredImage")}
              />
              <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800">
                  <Upload className="size-4" aria-hidden="true" />
                  Preview Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleImageFile(event.target.files?.[0])}
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={removeFeaturedImage}
                  disabled={!imagePreview}
                  leftIcon={<X className="size-4" aria-hidden="true" />}
                >
                  Remove
                </Button>
              </div>
            </Card>

            <Card
              className="shadow-sm"
              contentClassName="space-y-4"
              header={
                <div>
                  <h2 className="text-lg font-semibold text-foreground">SEO Metadata</h2>
                  <p className="mt-1 text-sm text-muted">Tune search display text before publishing.</p>
                </div>
              }
            >
              <Input
                label="SEO title"
                placeholder={title || "Article title"}
                error={form.formState.errors.seoTitle?.message}
                helperText={
                  <span className={getCounterTone(seoTitle.length, 70)}>
                    {seoTitle.length}/70 characters
                  </span>
                }
                {...form.register("seoTitle")}
              />
              <Textarea
                label="SEO description"
                rows={4}
                placeholder="Describe the article for search results."
                error={form.formState.errors.seoDescription?.message}
                helperText={
                  <span className={getCounterTone(seoDescription.length, 160)}>
                    {seoDescription.length}/160 characters
                  </span>
                }
                {...form.register("seoDescription")}
              />
            </Card>

            <Card className="shadow-sm" contentClassName="space-y-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => submitWithStatus("published")}
                isLoading={createMutation.isPending}
                leftIcon={<Send className="size-4" aria-hidden="true" />}
              >
                Publish Now
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => submitWithStatus("draft")}
                isLoading={createMutation.isPending}
                leftIcon={<Save className="size-4" aria-hidden="true" />}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                variant="danger"
                className="w-full"
                onClick={handleCancel}
                leftIcon={<Trash2 className="size-4" aria-hidden="true" />}
              >
                Delete / Cancel
              </Button>
            </Card>
          </aside>
        </section>
      </form>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Article Preview"
        description="Preview uses the current unsaved form values."
        className="max-w-4xl"
        footer={
          <Button type="button" onClick={() => setPreviewOpen(false)}>
            Close Preview
          </Button>
        }
      >
        <article className="space-y-5">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="" className="aspect-video w-full rounded-lg object-cover" />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <AdminStatusBadge status={previewValues.status} />
            {previewValues.featuredStatus === "featured" ? <Badge variant="success">Featured</Badge> : null}
            <Badge variant="neutral">{readingTime} min read</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-primary">{previewValues.category || "Uncategorized"}</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">
              {previewValues.title || "Untitled article"}
            </h2>
            {previewValues.excerpt ? (
              <p className="mt-3 text-base leading-7 text-muted">{previewValues.excerpt}</p>
            ) : null}
          </div>
          <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-foreground dark:border-slate-700 dark:bg-slate-900">
            {previewValues.content || "No content yet."}
          </div>
        </article>
      </Modal>

      <ConfirmActionModal
        open={cancelOpen}
        title="Discard new blog post?"
        description="This will leave the editor and discard unsaved changes."
        confirmLabel="Discard"
        destructive
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancel}
      />
    </main>
  );
}
