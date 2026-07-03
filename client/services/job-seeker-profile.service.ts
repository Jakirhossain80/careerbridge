"use client";

import { api } from "@/lib/api";
import type {
  JobSeekerProfile,
  JobSeekerProfileStats,
  JobSeekerProfileUpdatePayload,
  JobSeekerResumeSummary,
} from "@/types/job-seeker-profile.types";

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

export async function getJobSeekerProfile() {
  const response = await api.get<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
    "/job-seekers/me",
  );
  return unwrap<JobSeekerProfile>(response);
}

export async function updateJobSeekerProfile(
  payload: JobSeekerProfileUpdatePayload,
) {
  const response = await api.patch<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
    "/job-seekers/me",
    payload,
  );
  return unwrap<JobSeekerProfile>(response);
}

export async function uploadJobSeekerAvatar(formData: FormData) {
  const response = await api.post<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
    "/job-seekers/me/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return unwrap<JobSeekerProfile>(response);
}

export async function getJobSeekerProfileStats() {
  const response = await api.get<
    ApiEnvelope<JobSeekerProfileStats> | JobSeekerProfileStats
  >("/job-seekers/me/stats");
  return unwrap<JobSeekerProfileStats>(response);
}

export async function getMyResumes() {
  const response = await api.get<
    ApiEnvelope<JobSeekerResumeSummary[]> | JobSeekerResumeSummary[]
  >("/job-seekers/resumes");
  return unwrap<JobSeekerResumeSummary[]>(response);
}
