"use client";

import { api } from "@/lib/api";
import type { SavedJob, SavedJobsResponse } from "@/types/saved-job.types";

type ApiEnvelope<T> = { data: T };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  return response.data && typeof response.data === "object" && "data" in response.data
    ? (response.data.data as T)
    : (response.data as T);
}

export async function saveJob(jobId: string) {
  const response = await api.post<ApiEnvelope<SavedJob> | SavedJob>("/saved-jobs", {
    jobId,
  });
  return unwrap<SavedJob>(response);
}

export async function getSavedJobs(params: Record<string, unknown> = {}) {
  const response = await api.get<ApiEnvelope<SavedJobsResponse> | SavedJobsResponse>(
    "/saved-jobs/me",
    { params }
  );
  return unwrap<SavedJobsResponse>(response);
}

export async function unsaveJob(jobId: string) {
  const response = await api.delete<ApiEnvelope<SavedJob> | SavedJob>(
    `/saved-jobs/${jobId}`
  );
  return unwrap<SavedJob>(response);
}
