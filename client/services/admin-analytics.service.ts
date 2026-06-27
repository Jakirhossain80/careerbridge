"use client";

import { api } from "@/lib/api";
import type {
  AdminAnalyticsCategoryRow,
  AdminAnalyticsEmployerRow,
  AdminAnalyticsFilters,
  AdminAnalyticsJobRow,
  AdminAnalyticsOverview,
  AdminAnalyticsTrendPoint,
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

export const adminAnalyticsQueryKeys = {
  overview: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-overview", filters] as const,
  users: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-users", filters] as const,
  employers: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-employers", filters] as const,
  jobs: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-jobs", filters] as const,
  applications: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-applications", filters] as const,
  interviews: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-interviews", filters] as const,
  blogs: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-blogs", filters] as const,
  categories: (filters: AdminAnalyticsFilters) =>
    ["admin-analytics-categories", filters] as const,
};

export async function getAdminAnalyticsOverview(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsOverview> | AdminAnalyticsOverview>(
    "/admin/analytics/overview",
    { params: filters },
  );

  return unwrap<AdminAnalyticsOverview>(response);
}

export async function getAdminAnalyticsUsers(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsTrendPoint[]> | AdminAnalyticsTrendPoint[]>(
    "/admin/analytics/users",
    { params: filters },
  );

  return unwrap<AdminAnalyticsTrendPoint[]>(response);
}

export async function getAdminAnalyticsEmployers(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsEmployerRow[]> | AdminAnalyticsEmployerRow[]>(
    "/admin/analytics/employers",
    { params: filters },
  );

  return unwrap<AdminAnalyticsEmployerRow[]>(response);
}

export async function getAdminAnalyticsJobs(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsJobRow[]> | AdminAnalyticsJobRow[]>(
    "/admin/analytics/jobs",
    { params: filters },
  );

  return unwrap<AdminAnalyticsJobRow[]>(response);
}

export async function getAdminAnalyticsApplications(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsOverview["hiringFunnel"]> | AdminAnalyticsOverview["hiringFunnel"]>(
    "/admin/analytics/applications",
    { params: filters },
  );

  return unwrap<AdminAnalyticsOverview["hiringFunnel"]>(response);
}

export async function getAdminAnalyticsInterviews(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsTrendPoint[]> | AdminAnalyticsTrendPoint[]>(
    "/admin/analytics/interviews",
    { params: filters },
  );

  return unwrap<AdminAnalyticsTrendPoint[]>(response);
}

export async function getAdminAnalyticsBlogs(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsOverview["topBlogs"]> | AdminAnalyticsOverview["topBlogs"]>(
    "/admin/analytics/blogs",
    { params: filters },
  );

  return unwrap<AdminAnalyticsOverview["topBlogs"]>(response);
}

export async function getAdminAnalyticsCategories(filters: AdminAnalyticsFilters) {
  const response = await api.get<ApiEnvelope<AdminAnalyticsCategoryRow[]> | AdminAnalyticsCategoryRow[]>(
    "/admin/analytics/categories",
    { params: filters },
  );

  return unwrap<AdminAnalyticsCategoryRow[]>(response);
}
