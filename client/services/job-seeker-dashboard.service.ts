"use client";

import { api } from "@/lib/api";
import { mockJobSeekerDashboard } from "@/data/mock-job-seeker-dashboard";
import type {
  JobSeekerDashboardData,
  JobSeekerDashboardNotification,
  JobSeekerDashboardParams,
  JobSeekerRecommendedJob,
  JobSeekerRecentApplication,
  JobSeekerUpcomingInterview,
} from "@/types/job-seeker-dashboard.types";

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

export async function getJobSeekerDashboard() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerDashboardData> | JobSeekerDashboardData
    >("/job-seeker/dashboard");
    return unwrap<JobSeekerDashboardData>(response);
  }, mockJobSeekerDashboard);
}

export async function getJobSeekerProfile() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerDashboardData["profile"]> | JobSeekerDashboardData["profile"]
    >("/job-seekers/me");
    return unwrap<JobSeekerDashboardData["profile"]>(response);
  }, mockJobSeekerDashboard.profile);
}

export async function getMyApplications(params: JobSeekerDashboardParams = {}) {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerRecentApplication[]> | JobSeekerRecentApplication[]
    >("/applications/me", { params });
    return unwrap<JobSeekerRecentApplication[]>(response);
  }, mockJobSeekerDashboard.recentApplications.slice(0, params.limit ?? 5));
}

export async function getSavedJobs(params: JobSeekerDashboardParams = {}) {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerRecommendedJob[]> | JobSeekerRecommendedJob[]
    >("/saved-jobs/me", { params });
    return unwrap<JobSeekerRecommendedJob[]>(response);
  }, mockJobSeekerDashboard.recommendedJobs.slice(0, params.limit ?? 5));
}

export async function getMyInterviews(params: JobSeekerDashboardParams = {}) {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerUpcomingInterview[]> | JobSeekerUpcomingInterview[]
    >("/interviews/me", { params });
    return unwrap<JobSeekerUpcomingInterview[]>(response);
  }, mockJobSeekerDashboard.upcomingInterviews.slice(0, params.limit ?? 5));
}

export async function getRecommendedJobs(params: JobSeekerDashboardParams = {}) {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerRecommendedJob[]> | JobSeekerRecommendedJob[]
    >("/recommended-jobs", { params });
    return unwrap<JobSeekerRecommendedJob[]>(response);
  }, mockJobSeekerDashboard.recommendedJobs.slice(0, params.limit ?? 5));
}

export async function getNotifications(params: JobSeekerDashboardParams = {}) {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerDashboardNotification[]> | JobSeekerDashboardNotification[]
    >("/notifications", { params });
    return unwrap<JobSeekerDashboardNotification[]>(response);
  }, (mockJobSeekerDashboard.notifications ?? []).slice(0, params.limit ?? 5));
}
