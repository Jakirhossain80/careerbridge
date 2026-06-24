"use client";

import { api } from "@/lib/api";
import {
  mockJobSeekerProfile,
  mockJobSeekerProfileStats,
  mockJobSeekerResumes,
} from "@/data/mock-job-seeker-profile";
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

async function withDevelopmentFallback<T>(
  request: () => Promise<T>,
  fallback: T,
) {
  try {
    return await request();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return fallback;
  }
}

export async function getJobSeekerProfile() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
      "/job-seeker/profile",
    );
    return unwrap<JobSeekerProfile>(response);
  }, mockJobSeekerProfile);
}

export async function updateJobSeekerProfile(
  payload: JobSeekerProfileUpdatePayload,
) {
  return withDevelopmentFallback(async () => {
    const response = await api.patch<ApiEnvelope<JobSeekerProfile> | JobSeekerProfile>(
      "/job-seeker/profile",
      payload,
    );
    return unwrap<JobSeekerProfile>(response);
  }, {
    ...mockJobSeekerProfile,
    ...payload,
    profileCompletion: payload.profileCompletion ?? mockJobSeekerProfile.profileCompletion,
  });
}

export async function getJobSeekerProfileStats() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerProfileStats> | JobSeekerProfileStats
    >("/job-seeker/profile/stats");
    return unwrap<JobSeekerProfileStats>(response);
  }, mockJobSeekerProfileStats);
}

export async function getMyResumes() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerResumeSummary[]> | JobSeekerResumeSummary[]
    >("/resumes/me");
    return unwrap<JobSeekerResumeSummary[]>(response);
  }, mockJobSeekerResumes);
}
