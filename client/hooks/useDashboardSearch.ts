"use client";

import { useQuery } from "@tanstack/react-query";

import {
  dashboardSearchQueryKeys,
  normalizeDashboardSearchQuery,
  searchDashboard,
} from "@/services/dashboard-search.service";

export function useDashboardSearch(query: string, limitPerCategory = 5) {
  const normalizedQuery = normalizeDashboardSearchQuery(query);
  const params = { q: normalizedQuery, limitPerCategory };

  return useQuery({
    queryKey: dashboardSearchQueryKeys.results(params),
    queryFn: () => searchDashboard(params),
    enabled: normalizedQuery.length >= 2 && normalizedQuery.length <= 80,
    staleTime: 30_000,
  });
}
