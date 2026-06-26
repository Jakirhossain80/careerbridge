import type { AdminMeta } from "@/types/admin.types";

export type AdminCategoryStatus =
  | "active"
  | "inactive"
  | "archived"
  | "approved"
  | "flagged";

export type AdminCategorySortBy =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "most_jobs"
  | "least_jobs";

export type AdminCategoryFilters = {
  search?: string;
  status?: AdminCategoryStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  sortBy?: AdminCategorySortBy;
  page?: number;
  limit?: number;
};

export type AdminCategoryListParams = {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status: AdminCategoryStatus;
  jobsCount?: number;
  activeJobsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCategoriesResponse = {
  categories: AdminCategory[];
  meta: AdminMeta;
};

export type AdminCategoryStats = {
  totalCategories: number;
  activeJobs: number;
  averageJobsPerCategory: number;
  topPerformer?: string;
};

export type AdminCategoryFormValues = {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  status: AdminCategoryStatus;
};
