"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminApplicationQueryKeys,
  getAdminApplicationDetails,
  getAdminApplicationList,
  getAdminApplicationStats,
  relatedAdminApplicationInvalidations,
  updateAdminApplicationDetails,
} from "@/services/adminApplicationService";
import type {
  AdminApplicationListParams,
  AdminApplicationUpdatePayload,
} from "@/types/admin-application";

export function useAdminApplications(filters: AdminApplicationListParams) {
  return useQuery({
    queryKey: adminApplicationQueryKeys.list(filters),
    queryFn: () => getAdminApplicationList(filters),
  });
}

export function useAdminApplication(applicationId: string) {
  return useQuery({
    queryKey: adminApplicationQueryKeys.detail(applicationId),
    queryFn: () => getAdminApplicationDetails(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useAdminApplicationStats() {
  return useQuery({
    queryKey: adminApplicationQueryKeys.stats,
    queryFn: getAdminApplicationStats,
  });
}

export function useAdminApplicationMutations(applicationId?: string) {
  const queryClient = useQueryClient();

  const invalidateApplicationQueries = async () => {
    await Promise.all(
      relatedAdminApplicationInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );

    if (applicationId) {
      await queryClient.invalidateQueries({
        queryKey: adminApplicationQueryKeys.detail(applicationId),
      });
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({
      targetApplicationId,
      payload,
    }: {
      targetApplicationId: string;
      payload: AdminApplicationUpdatePayload;
    }) => updateAdminApplicationDetails(targetApplicationId, payload),
    onSuccess: invalidateApplicationQueries,
  });

  return {
    updateMutation,
    invalidateApplicationQueries,
  };
}
