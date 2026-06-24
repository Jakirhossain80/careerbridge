"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import type { TableColumn } from "@/components/ui/Table";
import {
  adminQueryKeys,
  deleteAdminBlog,
  getAdminBlogs,
  publishAdminBlog,
  unpublishAdminBlog,
} from "@/services/admin.service";
import type { AdminBlog, AdminListParams } from "@/types/admin.types";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

type BlogAction = {
  blog: AdminBlog;
  action: "publish" | "unpublish" | "archive";
} | null;

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<BlogAction>(null);

  const filters: AdminListParams = {
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 10,
    sortBy: "-createdAt",
  };

  const blogsQuery = useQuery({
    queryKey: adminQueryKeys.blogs(filters),
    queryFn: () => getAdminBlogs(filters),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!action) return null;
      if (action.action === "publish") return publishAdminBlog(action.blog._id);
      if (action.action === "unpublish") return unpublishAdminBlog(action.blog._id);
      return deleteAdminBlog(action.blog._id);
    },
    onSuccess: async () => {
      setAction(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const columns: Array<TableColumn<AdminBlog>> = [
    { key: "title", header: "Title", render: (item) => item.title },
    { key: "category", header: "Category", render: (item) => item.category ?? "Not set" },
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
          <Link
            href={`/admin/blogs/${item._id}/edit`}
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Edit
          </Link>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAction({ blog: item, action: "publish" })}
          >
            Publish
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAction({ blog: item, action: "unpublish" })}
          >
            Unpublish
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setAction({ blog: item, action: "archive" })}
          >
            Archive
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Blogs</h1>
          <p className="mt-1 text-sm text-muted">Create, edit, publish, and archive articles.</p>
        </div>
        <Button leftIcon={<Plus className="size-4" aria-hidden="true" />}>
          <Link href="/admin/blogs/new">New Blog</Link>
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
      {blogsQuery.isError ? (
        <ErrorState title="Blogs unavailable" message="Blogs could not be loaded." />
      ) : (
        <AdminDataTable
          columns={columns}
          data={blogsQuery.data?.blogs ?? []}
          loading={blogsQuery.isLoading}
          emptyMessage="No blogs found."
          meta={blogsQuery.data?.meta}
          onPageChange={setPage}
          getRowKey={(item) => item._id}
        />
      )}
      <ConfirmActionModal
        open={Boolean(action)}
        title={`${action?.action ?? "Update"} blog`}
        description={`Apply this moderation action to ${action?.blog.title ?? "this blog"}.`}
        confirmLabel="Confirm"
        destructive={action?.action === "archive"}
        isLoading={mutation.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => mutation.mutate()}
      />
    </main>
  );
}
