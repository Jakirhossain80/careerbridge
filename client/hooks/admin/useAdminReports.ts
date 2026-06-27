"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminReportQueryKeys,
  dismissAdminReport,
  escalateAdminReport,
  getAdminReportAnalytics,
  getAdminReportDetails,
  getAdminReportList,
  relatedAdminReportInvalidations,
  resolveAdminReport,
  updateAdminReportStatus,
} from "@/services/adminReportService";
import type {
  AdminReportAction,
  AdminReportFilters,
  AdminReportStatus,
} from "@/types/admin-report";

export function useAdminReports(filters: AdminReportFilters) {
  return useQuery({
    queryKey: adminReportQueryKeys.list(filters),
    queryFn: () => getAdminReportList(filters),
  });
}

export function useAdminReport(reportId: string) {
  return useQuery({
    queryKey: adminReportQueryKeys.detail(reportId),
    queryFn: () => getAdminReportDetails(reportId),
    enabled: Boolean(reportId),
  });
}

export function useAdminReportAnalytics(filters: AdminReportFilters) {
  return useQuery({
    queryKey: adminReportQueryKeys.analytics(filters),
    queryFn: () => getAdminReportAnalytics(filters),
  });
}

export function useAdminReportMutations() {
  const queryClient = useQueryClient();

  const invalidateReportQueries = async () => {
    await Promise.all(
      relatedAdminReportInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
  };

  const statusMutation = useMutation({
    mutationFn: ({
      reportId,
      status,
      moderatorNote,
    }: {
      reportId: string;
      status: AdminReportStatus;
      moderatorNote?: string;
    }) => updateAdminReportStatus(reportId, status, moderatorNote),
    onSuccess: invalidateReportQueries,
  });

  const actionMutation = useMutation({
    mutationFn: ({
      reportId,
      action,
      moderatorNote,
    }: {
      reportId: string;
      action: AdminReportAction;
      moderatorNote?: string;
    }) => {
      if (action === "resolved") return resolveAdminReport(reportId, moderatorNote);
      if (action === "dismissed") return dismissAdminReport(reportId, moderatorNote);
      if (action === "escalated") return escalateAdminReport(reportId, moderatorNote);
      if (action === "under_review") {
        return updateAdminReportStatus(reportId, "under_review", moderatorNote);
      }
      return Promise.reject(new Error("This moderation action is not supported by the backend yet."));
    },
    onSuccess: invalidateReportQueries,
  });

  return {
    statusMutation,
    actionMutation,
    invalidateReportQueries,
  };
}
