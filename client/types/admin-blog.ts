import type { AdminMeta, AdminUser } from "@/types/admin.types";

export type AdminBlogStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "unpublished"
  | "archived";

export type AdminBlogFeaturedStatus = "featured" | "not_featured";

export type AdminBlogSortBy =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "most_viewed"
  | "recently_updated";

export type AdminBlogFilters = {
  search?: string;
  status?: AdminBlogStatus | "all";
  featuredStatus?: AdminBlogFeaturedStatus | "all";
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: AdminBlogSortBy;
  page?: number;
  limit?: number;
};

export type AdminBlogListParams = {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type AdminBlog = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  author?: string | Pick<AdminUser, "_id" | "name" | "email">;
  category?: string;
  tags?: string[];
  status: AdminBlogStatus;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  viewCount?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminBlogsResponse = {
  blogs: AdminBlog[];
  meta: AdminMeta;
};

export type AdminBlogStats = {
  totalArticles: number;
  published: number;
  scheduled: number;
  monthlyViews: number;
};

export type AdminBlogFormValues = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags?: string;
  status: AdminBlogStatus;
  featuredStatus: AdminBlogFeaturedStatus;
  seoTitle?: string;
  seoDescription?: string;
};
