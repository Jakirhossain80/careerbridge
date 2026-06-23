"use client";

import { api } from "@/lib/api";
import type {
  JobSeekerProfile,
  JobSeekerProfileInput,
} from "@/types/job-seeker.types";

type ApiEnvelope<T> = { data: T };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  return response.data && typeof response.data === "object" && "data" in response.data
    ? (response.data.data as T)
    : (response.data as T);
}

export async function getJobSeekerProfile() {
  const response = await api.get<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
    "/job-seekers/me"
  );
  return unwrap<JobSeekerProfile>(response);
}

export async function updateJobSeekerProfile(payload: JobSeekerProfileInput) {
  const response = await api.patch<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
    "/job-seekers/me",
    payload
  );
  return unwrap<JobSeekerProfile>(response);
}
