"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import BlogBulkActionsBar from "@/components/admin/blogs/BlogBulkActionsBar";
import BlogFilters from "@/components/admin/blogs/BlogFilters";
import BlogFormModal from "@/components/admin/blogs/BlogFormModal";
import BlogStatsCards from "@/components/admin/blogs/BlogStatsCards";
import BlogsTable from "@/components/admin/blogs/BlogsTable";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import {
  useAdminBlogMutations,
  useAdminBlogs,
  useAdminBlogStats,
} from "@/hooks/admin/useAdminBlogs";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  AdminBlog,
  AdminBlogFilters,
  AdminBlogFormValues,
  AdminBlogListParams,
  AdminBlogSortBy,
  AdminBlogStatus,
} from "@/types/admin-blog";

type RequiredFilters = Required<AdminBlogFilters>;

type PendingStatusAction = {
  blog: AdminBlog;
  status: AdminBlogStatus;
} | null;

type PendingDeleteAction = {
  blog: AdminBlog;
} | null;

const defaultFilters: RequiredFilters = {
  search: "",
  status: "all",
  featuredStatus: "all",
  category: "",
  author: "",
  dateFrom: "",
  dateTo: "",
  createdFrom: "",
  createdTo: "",
  sortBy: "newest",
  page: 1,
  limit: 10,
};

const sortMap: Record<AdminBlogSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  title_asc: "title",
  title_desc: "-title",
  most_viewed: "-updatedAt",
  recently_updated: "-updatedAt",
};

function readFilters(searchParams: URLSearchParams): RequiredFilters {
  const page = Number(searchParams.get("page") ?? defaultFilters.page);

  return {
    search: searchParams.get("search") ?? defaultFilters.search,
    status:
      (searchParams.get("status") as AdminBlogStatus | "all" | null) ??
      defaultFilters.status,
    featuredStatus:
      (searchParams.get("featuredStatus") as RequiredFilters["featuredStatus"] | null) ??
      defaultFilters.featuredStatus,
    category: searchParams.get("category") ?? defaultFilters.category,
    author: searchParams.get("author") ?? defaultFilters.author,
    dateFrom: searchParams.get("dateFrom") ?? defaultFilters.dateFrom,
    dateTo: searchParams.get("dateTo") ?? defaultFilters.dateTo,
    createdFrom: searchParams.get("createdFrom") ?? defaultFilters.createdFrom,
    createdTo: searchParams.get("createdTo") ?? defaultFilters.createdTo,
    sortBy:
      (searchParams.get("sortBy") as AdminBlogSortBy | null) ??
      defaultFilters.sortBy,
    page: Number.isFinite(page) && page > 0 ? page : defaultFilters.page,
    limit: defaultFilters.limit,
  };
}

function getApiStatus(status: RequiredFilters["status"]) {
  if (status === "all") return undefined;
  if (status === "published" || status === "archived") return status;
  return "draft";
}

function getStatusCopy(action: PendingStatusAction) {
  if (!action) return null;

  const labels: Record<
    AdminBlogStatus,
    { title: string; confirmLabel: string; verb: string; destructive?: boolean }
  > = {
    draft: { title: "Move article to draft", confirmLabel: "Move to Draft", verb: "move to draft" },
    scheduled: { title: "Schedule article", confirmLabel: "Schedule", verb: "schedule" },
    published: { title: "Publish article", confirmLabel: "Publish", verb: "publish" },
    unpublished: {
      title: "Unpublish article",
      confirmLabel: "Unpublish",
      verb: "unpublish",
      destructive: true,
    },
    archived: {
      title: "Archive article",
      confirmLabel: "Archive",
      verb: "archive",
      destructive: true,
    },
  };

  return labels[action.status];
}

function isWithinDateRange(value: string | undefined, from: string, to: string) {
  if (!value) return !from && !to;

  const timestamp = new Date(value).getTime();

  if (from && timestamp < new Date(from).getTime()) return false;

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    if (timestamp > toDate.getTime()) return false;
  }

  return true;
}

function applyClientFilters(blogs: AdminBlog[], filters: RequiredFilters) {
  let nextBlogs = blogs;

  if (filters.featuredStatus !== "all") {
    const shouldBeFeatured = filters.featuredStatus === "featured";
    nextBlogs = nextBlogs.filter((blog) => Boolean(blog.featured) === shouldBeFeatured);
  }

  if (filters.createdFrom || filters.createdTo) {
    nextBlogs = nextBlogs.filter((blog) =>
      isWithinDateRange(blog.createdAt, filters.createdFrom, filters.createdTo),
    );
  }

  return nextBlogs;
}

export default function ManageBlogsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([]);
  const [formBlog, setFormBlog] = useState<AdminBlog | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [deleteAction, setDeleteAction] = useState<PendingDeleteAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const apiFilters: AdminBlogListParams = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      status: getApiStatus(filters.status),
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      sortBy: sortMap[filters.sortBy],
      page: filters.page,
      limit: filters.limit,
    }),
    [filters],
  );

  const blogsQuery = useAdminBlogs(apiFilters);
  const statsQuery = useAdminBlogStats();
  const categoriesQuery = useAdminCategories({
    page: 1,
    limit: 100,
    sortBy: "name",
  });
  const {
    createMutation,
    deleteMutation,
    statusMutation,
    updateMutation,
  } = useAdminBlogMutations();
  const statusCopy = getStatusCopy(statusAction);
  const blogs = useMemo(
    () => applyClientFilters(blogsQuery.data?.blogs ?? [], filters),
    [blogsQuery.data?.blogs, filters],
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

  function updateFilter<Key extends keyof AdminBlogFilters>(
    key: Key,
    value: AdminBlogFilters[Key],
  ) {
    setSelectedBlogIds([]);
    setQueryParams({ [key]: value, page: 1 } as Partial<RequiredFilters>);
  }

  function resetFilters() {
    setSelectedBlogIds([]);
    router.replace(pathname, { scroll: false });
  }

  function openCreate() {
    setFormBlog(null);
    setFormOpen(true);
  }

  function openEdit(blog: AdminBlog) {
    setFormBlog(blog);
    setFormOpen(true);
  }

  function submitBlog(values: AdminBlogFormValues) {
    if (formBlog?._id) {
      updateMutation.mutate(
        { blogId: formBlog._id, values },
        {
          onSuccess: () => {
            setFormOpen(false);
            setFormBlog(null);
            setFeedbackMessage("Blog article updated successfully.");
            setActionError("");
            appToast.success("Blog article updated successfully.");
          },
          onError: (error) => {
            const message = getApiErrorMessage(error) || "Unable to update blog article.";
            setActionError(message);
            appToast.error(message);
          },
        },
      );
      return;
    }

    createMutation.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
        setFeedbackMessage("Blog article created successfully.");
        setActionError("");
        appToast.success("Blog article created successfully.");
      },
      onError: (error) => {
        const message = getApiErrorMessage(error) || "Unable to create blog article.";
        setActionError(message);
        appToast.error(message);
      },
    });
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    statusMutation.mutate(
      {
        blogId: statusAction.blog._id,
        status: statusAction.status,
      },
      {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage("Blog publication status updated successfully.");
          setActionError("");
          appToast.success("Blog publication status updated successfully.");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error) || "Unable to update blog status.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function confirmDeleteAction() {
    if (!deleteAction) return;

    deleteMutation.mutate(
      { blogId: deleteAction.blog._id },
      {
        onSuccess: () => {
          setDeleteAction(null);
          setFeedbackMessage("Blog article archived successfully.");
          setActionError("");
          appToast.success("Blog article archived successfully.");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error) || "Unable to delete blog article.";
          setActionError(message);
          appToast.error(message);
        },
      },
    );
  }

  function handleToggleFeatured(blog: AdminBlog, featured: boolean) {
    setFeedbackMessage(
      featured
        ? `"${blog.title}" is ready to be marked featured when the backend field is available.`
        : `"${blog.title}" is ready to have featured status removed when the backend field is available.`,
    );
    setActionError("");
    appToast.info("Featured blog persistence is not available yet.");
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Manage Editorial Content
          </h1>
          <p className="mt-1 text-sm text-muted">
            Oversee, edit, and publish blog articles across the CareerBridge platform.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          leftIcon={<Plus className="size-4" aria-hidden="true" />}
        >
          Create New Article
        </Button>
      </div>

      <BlogStatsCards stats={statsQuery.data} loading={statsQuery.isLoading} />

      <BlogFilters
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

      {blogsQuery.isError ? (
        <ErrorState
          title="Unable to load blog articles"
          message="Blog articles could not be loaded. Please try again."
          onRetry={() => blogsQuery.refetch()}
        />
      ) : (
        <BlogsTable
          blogs={blogs}
          meta={blogsQuery.data?.meta}
          loading={blogsQuery.isLoading}
          selectedBlogIds={selectedBlogIds}
          onPageChange={(nextPage) => {
            setSelectedBlogIds([]);
            setQueryParams({ page: nextPage });
          }}
          onSelectionChange={setSelectedBlogIds}
          onEdit={openEdit}
          onChangeStatus={(blog, status) => setStatusAction({ blog, status })}
          onToggleFeatured={handleToggleFeatured}
          onDelete={(blog) => setDeleteAction({ blog })}
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: list, create, edit, publish, unpublish, archive,
        delete-as-archive, search, filtering, sorting, and pagination are
        connected. Scheduled publishing, featured image persistence, tags, SEO
        fields, view analytics, hard delete, and bulk actions are prepared for
        backend expansion.
      </footer>

      <BlogBulkActionsBar
        selectedCount={selectedBlogIds.length}
        onClearSelection={() => setSelectedBlogIds([])}
      />
      <BlogFormModal
        open={formOpen}
        blog={formBlog}
        categories={categoriesQuery.data?.categories}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setFormOpen(false);
          setFormBlog(null);
        }}
        onSubmit={submitBlog}
      />
      <ConfirmActionModal
        open={Boolean(statusAction && statusCopy)}
        title={statusCopy?.title ?? ""}
        description={
          statusAction && statusCopy
            ? `This will ${statusCopy.verb} "${statusAction.blog.title}".`
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
        title="Delete blog article"
        description={
          deleteAction
            ? `The current backend archives "${deleteAction.blog.title}" instead of hard deleting it.`
            : ""
        }
        confirmLabel="Archive"
        destructive
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteAction(null)}
        onConfirm={confirmDeleteAction}
      />
    </main>
  );
}
