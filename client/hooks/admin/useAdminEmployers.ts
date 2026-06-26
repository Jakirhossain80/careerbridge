"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminEmployerQueryKeys,
  getAdminEmployerDetails,
  getAdminEmployerList,
  getAdminEmployerStats,
  updateAdminEmployerAccountStatus,
  updateAdminEmployerDetails,
  updateAdminEmployerVerification,
} from "@/services/admin-employers.service";
import { adminQueryKeys } from "@/services/admin.service";
import type {
  AdminEmployerListParams,
  AdminEmployerUpdatePayload,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";

export function useAdminEmployers(filters: AdminEmployerListParams) {
  return useQuery({
    queryKey: adminEmployerQueryKeys.list(filters),
    queryFn: () => getAdminEmployerList(filters),
  });
}

export function useAdminEmployerStats() {
  return useQuery({
    queryKey: adminEmployerQueryKeys.stats,
    queryFn: getAdminEmployerStats,
  });
}

export function useAdminEmployer(employerId: string) {
  return useQuery({
    queryKey: adminEmployerQueryKeys.detail(employerId),
    queryFn: () => getAdminEmployerDetails(employerId),
    enabled: Boolean(employerId),
  });
}

export function useAdminEmployerMutations(employerId?: string) {
  const queryClient = useQueryClient();

  const invalidateEmployerQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: adminEmployerQueryKeys.lists });
    await queryClient.invalidateQueries({ queryKey: adminEmployerQueryKeys.stats });

    if (employerId) {
      await queryClient.invalidateQueries({
        queryKey: adminEmployerQueryKeys.detail(employerId),
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  const updateMutation = useMutation({
    mutationFn: ({
      targetEmployerId,
      payload,
    }: {
      targetEmployerId: string;
      payload: AdminEmployerUpdatePayload;
    }) => updateAdminEmployerDetails(targetEmployerId, payload),
    onSuccess: invalidateEmployerQueries,
  });

  const verificationMutation = useMutation({
    mutationFn: ({
      targetEmployerId,
      verificationStatus,
    }: {
      targetEmployerId: string;
      verificationStatus: AdminEmployerVerificationStatus;
    }) => updateAdminEmployerVerification(targetEmployerId, verificationStatus),
    onSuccess: invalidateEmployerQueries,
  });

  const accountStatusMutation = useMutation({
    mutationFn: ({
      ownerUserId,
      status,
    }: {
      ownerUserId: string;
      status: AdminUserStatus;
    }) => updateAdminEmployerAccountStatus(ownerUserId, status),
    onSuccess: invalidateEmployerQueries,
  });

  return {
    updateMutation,
    verificationMutation,
    accountStatusMutation,
    invalidateEmployerQueries,
  };
}
