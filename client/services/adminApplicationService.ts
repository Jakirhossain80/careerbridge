"use client";

import {
  adminQueryKeys,
  getAdminApplication,
  getAdminApplications,
  updateAdminApplicationStatus,
} from "@/services/admin.service";
import type {
  AdminApplicationListParams,
  AdminApplicationRecord,
  AdminApplicationsResponse,
  AdminApplicationStats,
  AdminApplicationUpdatePayload,
} from "@/types/admin-application";

export const adminApplicationQueryKeys = {
  lists: ["admin-applications"] as const,
  list: (filters: AdminApplicationListParams) =>
    ["admin-applications", filters] as const,
  details: ["admin-application"] as const,
  detail: (applicationId: string) => ["admin-application", applicationId] as const,
  stats: ["admin-application-stats"] as const,
};

export async function getAdminApplicationList(
  params: AdminApplicationListParams = {},
) {
  return getAdminApplications(params) as Promise<AdminApplicationsResponse>;
}

export async function getAdminApplicationDetails(applicationId: string) {
  return getAdminApplication(applicationId) as Promise<AdminApplicationRecord>;
}

export async function updateAdminApplicationDetails(
  applicationId: string,
  payload: AdminApplicationUpdatePayload,
) {
  return updateAdminApplicationStatus(
    applicationId,
    payload.status,
  ) as Promise<AdminApplicationRecord>;
}

function isThisMonth(value?: string) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
}

export async function getAdminApplicationStats() {
  const response = await getAdminApplicationList({
    page: 1,
    limit: 100,
    sortBy: "-createdAt",
  });

  return {
    totalApplications: response.meta.total,
    pendingReview: response.applications.filter((application) =>
      ["applied", "submitted", "pending", "under_review", "in_review", "reviewing"].includes(
        application.status,
      ),
    ).length,
    hiredThisMonth: response.applications.filter(
      (application) =>
        application.status === "hired" && isThisMonth(application.updatedAt),
    ).length,
    suspiciousActivity: response.applications.filter((application) =>
      ["flagged", "blocked"].includes(application.status),
    ).length,
  } satisfies AdminApplicationStats;
}

export const relatedAdminApplicationInvalidations = [
  adminApplicationQueryKeys.lists,
  adminApplicationQueryKeys.stats,
  adminQueryKeys.stats,
  ["admin-dashboard"] as const,
];
