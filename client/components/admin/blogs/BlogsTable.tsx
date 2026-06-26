"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ImageIcon } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import BlogRowActions from "@/components/admin/blogs/BlogRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type { AdminBlog, AdminBlogStatus } from "@/types/admin-blog";
import type { AdminMeta } from "@/types/admin.types";

type BlogsTableProps = {
  blogs: AdminBlog[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedBlogIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (blogIds: string[]) => void;
  onEdit: (blog: AdminBlog) => void;
  onChangeStatus: (blog: AdminBlog, status: AdminBlogStatus) => void;
  onToggleFeatured: (blog: AdminBlog, featured: boolean) => void;
  onDelete: (blog: AdminBlog) => void;
};

function formatDate(value?: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getAuthorName(blog: AdminBlog) {
  if (!blog.author) return "CareerBridge Admin";
  if (typeof blog.author === "string") return blog.author;

  return blog.author.name || blog.author.email || "CareerBridge Admin";
}

function getFeaturedImageAlt(blog: AdminBlog) {
  return blog.featuredImage ? `${blog.title} featured image` : "";
}

export default function BlogsTable({
  blogs,
  meta,
  loading = false,
  selectedBlogIds,
  onPageChange,
  onSelectionChange,
  onEdit,
  onChangeStatus,
  onToggleFeatured,
  onDelete,
}: BlogsTableProps) {
  const selectableIds = blogs.map((blog) => blog._id);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedBlogIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(selectedBlogIds.filter((id) => !selectableIds.includes(id)));
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedBlogIds, ...selectableIds])));
  }

  function toggleBlog(blogId: string) {
    if (selectedBlogIds.includes(blogId)) {
      onSelectionChange(selectedBlogIds.filter((id) => id !== blogId));
      return;
    }

    onSelectionChange([...selectedBlogIds, blogId]);
  }

  const columns: Array<TableColumn<AdminBlog>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible blogs"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (blog) => (
        <input
          type="checkbox"
          checked={selectedBlogIds.includes(blog._id)}
          onChange={() => toggleBlog(blog._id)}
          aria-label={`Select ${blog.title}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "article",
      header: "Article",
      render: (blog) => (
        <div className="flex min-w-80 items-center gap-3">
          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-400 ring-1 ring-slate-200">
            {blog.featuredImage ? (
              <Image
                src={blog.featuredImage}
                alt={getFeaturedImageAlt(blog)}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <ImageIcon className="size-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/blog/${blog.slug}`}
              className="font-semibold text-slate-950 hover:text-primary"
            >
              {blog.title}
            </Link>
            <p className="mt-0.5 max-w-72 truncate text-xs text-slate-500">
              /{blog.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (blog) => getAuthorName(blog),
    },
    {
      key: "category",
      header: "Category",
      render: (blog) => blog.category || "Uncategorized",
    },
    {
      key: "tags",
      header: "Tags",
      render: (blog) => {
        const tags = blog.tags ?? [];

        if (!tags.length) return <span className="text-slate-500">No tags</span>;

        return (
          <div className="flex max-w-72 flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 ? (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                +{tags.length - 3}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "views",
      header: "Views",
      render: (blog) => (blog.viewCount ?? 0).toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      render: (blog) => <AdminStatusBadge status={blog.status} />,
    },
    {
      key: "featured",
      header: "Featured",
      render: (blog) => (
        <AdminStatusBadge status={blog.featured ? "featured" : "not_featured"} />
      ),
    },
    {
      key: "publishedAt",
      header: "Published",
      render: (blog) => formatDate(blog.publishedAt),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (blog) => formatDate(blog.createdAt),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (blog) => formatDate(blog.updatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (blog) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/blog/${blog.slug}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${blog.title}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <BlogRowActions
            blog={blog}
            onEdit={onEdit}
            onChangeStatus={onChangeStatus}
            onToggleFeatured={onToggleFeatured}
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
      data={blogs}
      loading={loading}
      emptyMessage="No blog articles found. Try adjusting your filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(blog) => blog._id}
    />
  );
}
