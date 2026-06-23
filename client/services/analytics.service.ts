"use client";

import { api } from "@/lib/api";
import { mockEmployerAnalytics } from "@/data/mock-employer-analytics";
import type {
  EmployerAnalyticsFilters,
  EmployerAnalyticsOverview,
} from "@/types/analytics.types";

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

function filterMockAnalytics(
  params: EmployerAnalyticsFilters,
): EmployerAnalyticsOverview {
  const search = params.search?.trim().toLowerCase();
  const status = params.status && params.status !== "all" ? params.status : undefined;

  const topPerformingJobs = mockEmployerAnalytics.topPerformingJobs.filter((job) => {
    const matchesSearch = search
      ? [job.title, job.category, job.workMode ?? ""].some((value) =>
          value.toLowerCase().includes(search),
        )
      : true;
    const matchesStatus = status ? job.status === status : true;
    const matchesJob = params.jobId ? job.jobId === params.jobId : true;

    return matchesSearch && matchesStatus && matchesJob;
  });

  return {
    ...mockEmployerAnalytics,
    topPerformingJobs,
  };
}

async function getAnalyticsSection<T>(
  endpoint: string,
  params: EmployerAnalyticsFilters,
  fallback: T,
) {
  try {
    const response = await api.get<ApiEnvelope<T> | T>(endpoint, { params });
    return unwrap<T>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return fallback;
  }
}

export async function getEmployerAnalytics(
  params: EmployerAnalyticsFilters,
) {
  return getAnalyticsSection<EmployerAnalyticsOverview>(
    "/analytics/employer/overview",
    params,
    filterMockAnalytics(params),
  );
}

export async function getEmployerAnalyticsOverview(
  params: EmployerAnalyticsFilters,
) {
  return getAnalyticsSection(
    "/analytics/employer/overview",
    params,
    filterMockAnalytics(params),
  );
}

export async function getEmployerJobAnalytics(
  params: EmployerAnalyticsFilters,
) {
  return getAnalyticsSection(
    "/analytics/employer/jobs",
    params,
    filterMockAnalytics(params).topPerformingJobs,
  );
}

export async function getEmployerApplicationAnalytics(
  params: EmployerAnalyticsFilters,
) {
  return getAnalyticsSection(
    "/analytics/employer/applications",
    params,
    filterMockAnalytics(params).applicationTrends,
  );
}

export async function getEmployerInterviewAnalytics(
  params: EmployerAnalyticsFilters,
) {
  return getAnalyticsSection(
    "/analytics/employer/interviews",
    params,
    filterMockAnalytics(params).recruitmentFunnel ?? [],
  );
}

export async function getEmployerHiringAnalytics(
  params: EmployerAnalyticsFilters,
) {
  return getAnalyticsSection(
    "/analytics/employer/hiring",
    params,
    filterMockAnalytics(params).recruitmentFunnel ?? [],
  );
}

export async function exportEmployerAnalyticsCsv(
  params: EmployerAnalyticsFilters,
) {
  const response = await api.get<Blob>("/analytics/employer/export", {
    params,
    responseType: "blob",
  });

  return response.data;
}
