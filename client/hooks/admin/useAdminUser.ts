"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminQueryKeys,
  blockUser,
  getAdminUser,
  unblockUser,
  updateAdminUser,
  updateUserRole,
  updateUserStatus,
} from "@/services/admin.service";
import { adminDashboardQueryKeys } from "@/services/admin-dashboard.service";
import type { AdminUser, UserRole, UserStatus } from "@/types/admin-user.types";

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminQueryKeys.user(userId),
    queryFn: () => getAdminUser(userId),
    enabled: Boolean(userId),
  });
}

export function useAdminUserMutations(userId: string) {
  const queryClient = useQueryClient();

  const invalidateAdminUserQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.user(userId) });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.userLists });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: adminDashboardQueryKeys.dashboard });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<AdminUser>) => updateAdminUser(userId, payload),
    onSuccess: invalidateAdminUserQueries,
  });

  const roleMutation = useMutation({
    mutationFn: (role: UserRole) => updateUserRole(userId, role),
    onSuccess: invalidateAdminUserQueries,
  });

  const statusMutation = useMutation({
    mutationFn: (status: UserStatus) => updateUserStatus(userId, status),
    onSuccess: invalidateAdminUserQueries,
  });

  const blockMutation = useMutation({
    mutationFn: (action: "block" | "unblock") =>
      action === "block" ? blockUser(userId) : unblockUser(userId),
    onSuccess: invalidateAdminUserQueries,
  });

  return {
    updateMutation,
    roleMutation,
    statusMutation,
    blockMutation,
    invalidateAdminUserQueries,
  };
}
