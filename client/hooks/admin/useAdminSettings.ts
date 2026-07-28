"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminSettingsQueryKeys,
  getAdminSettings,
  getAdminSettingsCategories,
  resetAdminSettings,
  updateAdminSettings,
} from "@/services/adminSettingsService";
import { adminDashboardQueryKeys } from "@/services/admin-dashboard.service";
import type { AdminSystemSettingsPayload } from "@/types/admin-settings";

export function useAdminSettings() {
  return useQuery({
    queryKey: adminSettingsQueryKeys.settings,
    queryFn: getAdminSettings,
    staleTime: 60_000,
  });
}

export function useAdminSettingsCategories() {
  return useQuery({
    queryKey: adminSettingsQueryKeys.categories,
    queryFn: getAdminSettingsCategories,
    staleTime: 300_000,
  });
}

export function useAdminSettingsMutations() {
  const queryClient = useQueryClient();

  const invalidateSettings = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminSettingsQueryKeys.settings }),
      queryClient.invalidateQueries({ queryKey: adminSettingsQueryKeys.categories }),
      queryClient.invalidateQueries({ queryKey: adminSettingsQueryKeys.auditLog }),
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKeys.dashboard }),
    ]);
  };

  const updateMutation = useMutation({
    mutationFn: (payload: AdminSystemSettingsPayload) => updateAdminSettings(payload),
    onSuccess: invalidateSettings,
  });

  const resetMutation = useMutation({
    mutationFn: resetAdminSettings,
    onSuccess: invalidateSettings,
  });

  return {
    updateMutation,
    resetMutation,
    invalidateSettings,
  };
}
