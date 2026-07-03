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
import type {
  JobSeekerProfile as JobSeekerProfileResponse,
  JobSeekerProfileStats,
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

function isMissingEndpoint(error: unknown) {
  const candidate = error as { response?: { status?: unknown } };

  return (
    typeof error === "object" &&
    error !== null &&
    candidate.response?.status === 404
  );
}

async function withOptionalFallback<T>(
  request: () => Promise<T>,
  fallback: T,
) {
  try {
    return await request();
  } catch (error) {
    if (process.env.NODE_ENV !== "production" || isMissingEndpoint(error)) {
      return fallback;
    }

    throw error;
  }
}

export async function getJobSeekerDashboard() {
  const [profile, stats, resumes, recentApplications, interviews, recommendedJobs, notifications] =
    await Promise.all([
      getJobSeekerProfile(),
      getJobSeekerProfileStats(),
      getMyResumes(),
      getMyApplications({ limit: 5 }),
      getMyInterviews({ limit: 5 }),
      getRecommendedJobs({ limit: 5 }),
      getNotifications({ limit: 5 }),
    ]);

  return {
    profile: {
      fullName: profile.fullName,
      email: profile.email,
      avatar: profile.avatar,
      headline: profile.headline,
      profileCompletion: profile.profileCompletion ?? 0,
      resumeUploaded: Boolean(profile.resume ?? resumes[0]),
    },
    metrics: {
      totalApplied: stats.appliedJobs,
      activeApplications: recentApplications.length,
      savedJobs: stats.savedJobs,
      interviews: stats.interviews,
      jobAlerts: mockJobSeekerDashboard.metrics.jobAlerts,
      recommendedJobs: recommendedJobs.length,
    },
    recentApplications,
    upcomingInterviews: interviews,
    recommendedJobs,
    notifications,
  } satisfies JobSeekerDashboardData;
}

export async function getJobSeekerProfile() {
  const response = await api.get<
    ApiEnvelope<JobSeekerProfileResponse> | JobSeekerProfileResponse
  >("/job-seekers/me");
  return unwrap<JobSeekerProfileResponse>(response);
}

export async function getJobSeekerProfileStats() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerProfileStats> | JobSeekerProfileStats
    >("/job-seekers/me/stats");
    return unwrap<JobSeekerProfileStats>(response);
  }, {
    appliedJobs: mockJobSeekerDashboard.metrics.totalApplied,
    savedJobs: mockJobSeekerDashboard.metrics.savedJobs,
    interviews: mockJobSeekerDashboard.metrics.interviews,
    profileViews: 0,
  });
}

export async function getMyResumes() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerResumeSummary[]> | JobSeekerResumeSummary[]
    >("/job-seekers/resumes");
    return unwrap<JobSeekerResumeSummary[]>(response);
  }, []);
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
  return withOptionalFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerUpcomingInterview[]> | JobSeekerUpcomingInterview[]
    >("/interviews/me", { params });
    return unwrap<JobSeekerUpcomingInterview[]>(response);
  }, process.env.NODE_ENV === "production"
    ? []
    : mockJobSeekerDashboard.upcomingInterviews.slice(0, params.limit ?? 5));
}

export async function getRecommendedJobs(params: JobSeekerDashboardParams = {}) {
  return withOptionalFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerRecommendedJob[]> | JobSeekerRecommendedJob[]
    >("/recommended-jobs", { params });
    return unwrap<JobSeekerRecommendedJob[]>(response);
  }, process.env.NODE_ENV === "production"
    ? []
    : mockJobSeekerDashboard.recommendedJobs.slice(0, params.limit ?? 5));
}

export async function getNotifications(params: JobSeekerDashboardParams = {}) {
  return withDevelopmentFallback(async () => {
    const response = await api.get<
      ApiEnvelope<JobSeekerDashboardNotification[]> | JobSeekerDashboardNotification[]
    >("/notifications", { params });
    return unwrap<JobSeekerDashboardNotification[]>(response);
  }, (mockJobSeekerDashboard.notifications ?? []).slice(0, params.limit ?? 5));
}
