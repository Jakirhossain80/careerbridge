"use client";

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/services/admin.service";
import { adminQueryKeys } from "@/services/admin.service";
import type {
  AdminCategoriesResponse,
  AdminCategory,
  AdminCategoryFormValues,
  AdminCategoryListParams,
  AdminCategoryStats,
  AdminCategoryStatus,
} from "@/types/admin-category";

export const adminCategoryQueryKeys = {
  lists: ["admin-categories"] as const,
  list: (filters: AdminCategoryListParams) =>
    ["admin-categories", filters] as const,
  details: ["admin-category"] as const,
  detail: (categoryId: string) => ["admin-category", categoryId] as const,
  stats: ["admin-category-stats"] as const,
};

function toSupportedStatus(status: AdminCategoryStatus): "active" | "inactive" {
  return status === "active" ? "active" : "inactive";
}

function toApiPayload(values: AdminCategoryFormValues) {
  return {
    name: values.name,
    slug: values.slug?.trim() || undefined,
    icon: values.icon?.trim() || undefined,
    status: toSupportedStatus(values.status),
  };
}

export async function getAdminCategoryList(
  params: AdminCategoryListParams = {},
) {
  return getAdminCategories(params) as Promise<AdminCategoriesResponse>;
}

export async function createAdminCategoryRecord(values: AdminCategoryFormValues) {
  return createAdminCategory(toApiPayload(values)) as Promise<AdminCategory>;
}

export async function updateAdminCategoryRecord(
  categoryId: string,
  values: Partial<AdminCategoryFormValues>,
) {
  const payload = {
    ...(values.name !== undefined ? { name: values.name } : {}),
    ...(values.slug !== undefined ? { slug: values.slug?.trim() || undefined } : {}),
    ...(values.icon !== undefined ? { icon: values.icon?.trim() || undefined } : {}),
    ...(values.status !== undefined
      ? { status: toSupportedStatus(values.status) }
      : {}),
  };

  return updateAdminCategory(categoryId, payload) as Promise<AdminCategory>;
}

export async function updateAdminCategoryStatus(
  categoryId: string,
  status: AdminCategoryStatus,
) {
  return updateAdminCategoryRecord(categoryId, { status });
}

export async function deleteAdminCategoryRecord(categoryId: string) {
  return deleteAdminCategory(categoryId) as Promise<AdminCategory>;
}

export async function getAdminCategoryStats() {
  const response = await getAdminCategoryList({
    page: 1,
    limit: 100,
    sortBy: "name",
  });
  const activeJobs = response.categories.reduce(
    (total, category) => total + (category.activeJobsCount ?? 0),
    0,
  );
  const totalJobs = response.categories.reduce(
    (total, category) => total + (category.jobsCount ?? 0),
    0,
  );
  const topPerformer = [...response.categories].sort(
    (a, b) => (b.activeJobsCount ?? b.jobsCount ?? 0) - (a.activeJobsCount ?? a.jobsCount ?? 0),
  )[0];

  return {
    totalCategories: response.meta.total,
    activeJobs,
    averageJobsPerCategory:
      response.categories.length > 0 ? totalJobs / response.categories.length : 0,
    topPerformer: topPerformer?.name,
  } satisfies AdminCategoryStats;
}

export const relatedAdminCategoryInvalidations = [
  adminCategoryQueryKeys.lists,
  adminCategoryQueryKeys.stats,
  adminQueryKeys.stats,
  ["admin-dashboard"] as const,
  ["categories"] as const,
];
