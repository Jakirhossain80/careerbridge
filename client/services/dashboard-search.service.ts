"use client";

import { api } from "@/lib/api";
import type {
  DashboardSearchParams,
  DashboardSearchResponse,
} from "@/types/dashboard-search.types";

type ApiEnvelope<T> = {
  data: T;
};

export const normalizeDashboardSearchQuery = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const dashboardSearchQueryKeys = {
  all: ["dashboard-search"] as const,
  results: (params: DashboardSearchParams) =>
    [...dashboardSearchQueryKeys.all, params] as const,
};

export async function searchDashboard(params: DashboardSearchParams) {
  const response = await api.get<ApiEnvelope<DashboardSearchResponse>>(
    "/dashboard/search",
    { params },
  );
  return response.data.data;
}
