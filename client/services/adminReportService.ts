"use client";

import { api } from "@/lib/api";
import type {
  AdminReport,
  AdminReportActionPayload,
  AdminReportAnalytics,
  AdminReportFilters,
  AdminReportsResponse,
  AdminReportStatus,
} from "@/types/admin-report";

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

export const adminReportQueryKeys = {
  lists: ["admin-reports"] as const,
  list: (filters: AdminReportFilters) => ["admin-reports", filters] as const,
  details: ["admin-report"] as const,
  detail: (reportId: string) => ["admin-report", reportId] as const,
  analytics: (filters: AdminReportFilters) =>
    ["admin-report-analytics", filters] as const,
};

function toApiParams(filters: AdminReportFilters) {
  return {
    ...filters,
    status: filters.status && filters.status !== "all" ? filters.status : undefined,
    severity:
      filters.severity && filters.severity !== "all" ? filters.severity : undefined,
    reason: filters.reason && filters.reason !== "all" ? filters.reason : undefined,
    targetType:
      filters.targetType && filters.targetType !== "all"
        ? filters.targetType
        : undefined,
  };
}

export async function getAdminReportList(filters: AdminReportFilters = {}) {
  const response = await api.get<ApiEnvelope<AdminReportsResponse> | AdminReportsResponse>(
    "/admin/reports",
    { params: toApiParams(filters) },
  );

  return unwrap<AdminReportsResponse>(response);
}

export async function getAdminReportDetails(reportId: string) {
  const response = await api.get<ApiEnvelope<AdminReport> | AdminReport>(
    `/admin/reports/${reportId}`,
  );

  return unwrap<AdminReport>(response);
}

export async function getAdminReportAnalytics(filters: AdminReportFilters = {}) {
  const response = await api.get<ApiEnvelope<AdminReportAnalytics> | AdminReportAnalytics>(
    "/admin/reports/analytics",
    { params: toApiParams(filters) },
  );

  return unwrap<AdminReportAnalytics>(response);
}

export async function updateAdminReport(reportId: string, payload: AdminReportActionPayload) {
  const response = await api.patch<ApiEnvelope<AdminReport> | AdminReport>(
    `/admin/reports/${reportId}`,
    payload,
  );

  return unwrap<AdminReport>(response);
}

export async function updateAdminReportStatus(
  reportId: string,
  status: AdminReportStatus,
  moderatorNote?: string,
) {
  return updateAdminReport(reportId, {
    status,
    moderatorNote,
    resolutionNote: moderatorNote,
  });
}

export async function resolveAdminReport(reportId: string, moderatorNote?: string) {
  const response = await api.post<ApiEnvelope<AdminReport> | AdminReport>(
    `/admin/reports/${reportId}/resolve`,
    { moderatorNote, resolutionNote: moderatorNote },
  );

  return unwrap<AdminReport>(response);
}

export async function dismissAdminReport(reportId: string, moderatorNote?: string) {
  const response = await api.post<ApiEnvelope<AdminReport> | AdminReport>(
    `/admin/reports/${reportId}/dismiss`,
    { moderatorNote, resolutionNote: moderatorNote },
  );

  return unwrap<AdminReport>(response);
}

export async function escalateAdminReport(reportId: string, moderatorNote?: string) {
  const response = await api.post<ApiEnvelope<AdminReport> | AdminReport>(
    `/admin/reports/${reportId}/escalate`,
    { moderatorNote, resolutionNote: moderatorNote },
  );

  return unwrap<AdminReport>(response);
}

export const relatedAdminReportInvalidations = [
  adminReportQueryKeys.lists,
  adminReportQueryKeys.details,
  ["admin-report-analytics"] as const,
  ["admin-stats"] as const,
  ["admin-dashboard"] as const,
];
