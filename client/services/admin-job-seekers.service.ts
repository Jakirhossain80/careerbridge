"use client";

import { api } from "@/lib/api";
import type {
  AdminJobSeeker,
  AdminJobSeekerListParams,
  AdminJobSeekerStats,
  AdminJobSeekerStatus,
  AdminJobSeekerUpdatePayload,
  AdminJobSeekersResponse,
} from "@/types/admin-job-seeker.types";

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

export const adminJobSeekerQueryKeys = {
  lists: ["admin-job-seekers"] as const,
  list: (filters: AdminJobSeekerListParams) =>
    ["admin-job-seekers", filters] as const,
  details: ["admin-job-seeker"] as const,
  detail: (jobSeekerId: string) => ["admin-job-seeker", jobSeekerId] as const,
  stats: ["admin-job-seeker-stats"] as const,
};

export async function getAdminJobSeekers(params: AdminJobSeekerListParams = {}) {
  const response = await api.get<ApiEnvelope<AdminJobSeekersResponse> | AdminJobSeekersResponse>(
    "/admin/job-seekers",
    { params },
  );
  return unwrap<AdminJobSeekersResponse>(response);
}

export async function getAdminJobSeekerStats() {
  const response = await api.get<ApiEnvelope<AdminJobSeekerStats> | AdminJobSeekerStats>(
    "/admin/job-seekers/stats",
  );
  return unwrap<AdminJobSeekerStats>(response);
}

export async function getAdminJobSeeker(jobSeekerId: string) {
  const response = await api.get<ApiEnvelope<AdminJobSeeker> | AdminJobSeeker>(
    `/admin/job-seekers/${jobSeekerId}`,
  );
  return unwrap<AdminJobSeeker>(response);
}

export async function updateAdminJobSeeker(
  jobSeekerId: string,
  payload: AdminJobSeekerUpdatePayload,
) {
  const response = await api.patch<ApiEnvelope<AdminJobSeeker> | AdminJobSeeker>(
    `/admin/job-seekers/${jobSeekerId}`,
    payload,
  );
  return unwrap<AdminJobSeeker>(response);
}

export async function updateAdminJobSeekerStatus(
  jobSeekerId: string,
  status: AdminJobSeekerStatus,
) {
  const response = await api.patch<ApiEnvelope<AdminJobSeeker> | AdminJobSeeker>(
    `/admin/job-seekers/${jobSeekerId}/status`,
    { status },
  );
  return unwrap<AdminJobSeeker>(response);
}
