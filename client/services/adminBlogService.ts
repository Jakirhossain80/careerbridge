"use client";

import {
  adminQueryKeys,
  createAdminBlog,
  deleteAdminBlog,
  getAdminBlog,
  getAdminBlogs,
  publishAdminBlog,
  unpublishAdminBlog,
  updateAdminBlog,
} from "@/services/admin.service";
import type {
  AdminBlog,
  AdminBlogFormValues,
  AdminBlogListParams,
  AdminBlogsResponse,
  AdminBlogStats,
  AdminBlogStatus,
} from "@/types/admin-blog";

export const adminBlogQueryKeys = {
  lists: ["admin-blogs"] as const,
  list: (filters: AdminBlogListParams) => ["admin-blogs", filters] as const,
  details: ["admin-blog"] as const,
  detail: (blogId: string) => ["admin-blog", blogId] as const,
  stats: ["admin-blog-stats"] as const,
};

function toSupportedStatus(status: AdminBlogStatus): "draft" | "published" | "archived" {
  if (status === "published") return "published";
  if (status === "archived") return "archived";
  return "draft";
}

function toApiPayload(values: AdminBlogFormValues) {
  return {
    title: values.title,
    slug: values.slug?.trim() || undefined,
    category: values.category?.trim() || undefined,
    content: values.content,
    status: toSupportedStatus(values.status),
  };
}

export async function getAdminBlogList(params: AdminBlogListParams = {}) {
  return getAdminBlogs(params) as Promise<AdminBlogsResponse>;
}

export async function getAdminBlogDetails(blogId: string) {
  return getAdminBlog(blogId) as Promise<AdminBlog>;
}

export async function createAdminBlogRecord(values: AdminBlogFormValues) {
  return createAdminBlog(toApiPayload(values)) as Promise<AdminBlog>;
}

export async function updateAdminBlogRecord(
  blogId: string,
  values: AdminBlogFormValues,
) {
  return updateAdminBlog(blogId, toApiPayload(values)) as Promise<AdminBlog>;
}

export async function updateAdminBlogStatus(blogId: string, status: AdminBlogStatus) {
  if (status === "published") return publishAdminBlog(blogId) as Promise<AdminBlog>;
  if (status === "unpublished" || status === "draft" || status === "scheduled") {
    return unpublishAdminBlog(blogId) as Promise<AdminBlog>;
  }
  return deleteAdminBlog(blogId) as Promise<AdminBlog>;
}

export async function deleteAdminBlogRecord(blogId: string) {
  return deleteAdminBlog(blogId) as Promise<AdminBlog>;
}

function isThisMonth(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export async function getAdminBlogStats() {
  const response = await getAdminBlogList({ page: 1, limit: 100, sortBy: "-createdAt" });

  return {
    totalArticles: response.meta.total,
    published: response.blogs.filter((blog) => blog.status === "published").length,
    scheduled: response.blogs.filter((blog) => blog.status === "scheduled").length,
    monthlyViews: response.blogs
      .filter((blog) => isThisMonth(blog.publishedAt ?? blog.updatedAt))
      .reduce((total, blog) => total + (blog.viewCount ?? 0), 0),
  } satisfies AdminBlogStats;
}

export const relatedAdminBlogInvalidations = [
  adminBlogQueryKeys.lists,
  adminBlogQueryKeys.stats,
  adminQueryKeys.stats,
  ["admin-dashboard"] as const,
  ["blogs"] as const,
];
