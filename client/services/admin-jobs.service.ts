"use client";

import { api } from "@/lib/api";
import { adminQueryKeys } from "@/services/admin.service";
import type {
  AdminJob,
  AdminJobApprovalStatus,
  AdminJobListParams,
  AdminJobsResponse,
  AdminJobStatus,
  AdminJobUpdatePayload,
} from "@/types/admin-job.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  const payload = response.data;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export const adminJobQueryKeys = {
  lists: ["admin-jobs"] as const,
  list: (filters: AdminJobListParams) => ["admin-jobs", filters] as const,
  pendingLists: ["pending-jobs"] as const,
  pendingList: (filters: AdminJobListParams) => ["pending-jobs", filters] as const,
  details: ["admin-job"] as const,
  detail: (jobId: string) => ["admin-job", jobId] as const,
};

export async function getAdminJobList(params: AdminJobListParams = {}) {
  const response = await api.get<ApiEnvelope<AdminJobsResponse> | AdminJobsResponse>(
    "/admin/jobs",
    { params },
  );
  return unwrap<AdminJobsResponse>(response);
}

export async function getPendingAdminJobList(params: AdminJobListParams = {}) {
  return getAdminJobList({ status: "pending", ...params });
}

export async function getAdminJobDetails(jobId: string) {
  const response = await api.get<ApiEnvelope<AdminJob> | AdminJob>(
    `/admin/jobs/${jobId}`,
  );
  return unwrap<AdminJob>(response);
}

export async function updateAdminJobDetails(
  jobId: string,
  payload: AdminJobUpdatePayload,
) {
  const response = await api.patch<ApiEnvelope<AdminJob> | AdminJob>(
    `/admin/jobs/${jobId}`,
    payload,
  );
  return unwrap<AdminJob>(response);
}

export async function updateAdminJobStatus(
  jobId: string,
  status: AdminJobStatus,
) {
  return updateAdminJobDetails(jobId, { status });
}

export async function updateAdminJobApproval(
  jobId: string,
  approvalStatus: AdminJobApprovalStatus,
  reason?: string,
) {
  if (approvalStatus === "approved") {
    const response = await api.patch<ApiEnvelope<AdminJob> | AdminJob>(
      `/admin/jobs/${jobId}/approve`,
      { reason },
    );
    return unwrap<AdminJob>(response);
  }

  if (approvalStatus === "rejected") {
    const response = await api.patch<ApiEnvelope<AdminJob> | AdminJob>(
      `/admin/jobs/${jobId}/reject`,
      { reason },
    );
    return unwrap<AdminJob>(response);
  }

  return updateAdminJobDetails(jobId, { status: "pending" });
}

export async function archiveAdminJob(jobId: string) {
  const response = await api.delete<ApiEnvelope<AdminJob> | AdminJob>(
    `/admin/jobs/${jobId}`,
  );
  return unwrap<AdminJob>(response);
}

export const relatedAdminJobInvalidations = [
  adminJobQueryKeys.lists,
  adminJobQueryKeys.pendingLists,
  adminQueryKeys.stats,
  ["admin-dashboard"] as const,
  ["admin-applications"] as const,
];
