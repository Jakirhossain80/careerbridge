"use client";

import { useQuery } from "@tanstack/react-query";

import {
  adminAnalyticsQueryKeys,
  getAdminAnalyticsApplications,
  getAdminAnalyticsBlogs,
  getAdminAnalyticsCategories,
  getAdminAnalyticsEmployers,
  getAdminAnalyticsInterviews,
  getAdminAnalyticsJobs,
  getAdminAnalyticsOverview,
  getAdminAnalyticsUsers,
} from "@/services/admin-analytics.service";
import type { AdminAnalyticsFilters } from "@/types/analytics.types";

export function useAdminAnalyticsOverview(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.overview(filters),
    queryFn: () => getAdminAnalyticsOverview(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsUsers(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.users(filters),
    queryFn: () => getAdminAnalyticsUsers(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsEmployers(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.employers(filters),
    queryFn: () => getAdminAnalyticsEmployers(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsJobs(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.jobs(filters),
    queryFn: () => getAdminAnalyticsJobs(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsApplications(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.applications(filters),
    queryFn: () => getAdminAnalyticsApplications(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsInterviews(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.interviews(filters),
    queryFn: () => getAdminAnalyticsInterviews(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsBlogs(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.blogs(filters),
    queryFn: () => getAdminAnalyticsBlogs(filters),
    staleTime: 60_000,
  });
}

export function useAdminAnalyticsCategories(filters: AdminAnalyticsFilters) {
  return useQuery({
    queryKey: adminAnalyticsQueryKeys.categories(filters),
    queryFn: () => getAdminAnalyticsCategories(filters),
    staleTime: 60_000,
  });
}
