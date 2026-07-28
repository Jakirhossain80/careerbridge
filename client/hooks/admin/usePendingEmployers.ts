"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminEmployerQueryKeys } from "@/services/admin-employers.service";
import { adminQueryKeys } from "@/services/admin.service";
import { adminDashboardQueryKeys } from "@/services/admin-dashboard.service";
import {
  getPendingEmployerDetails,
  getPendingEmployers,
  pendingEmployerQueryKeys,
  rejectPendingEmployer,
  updatePendingEmployerAccountStatus,
  updatePendingEmployerVerification,
} from "@/services/adminEmployerVerificationService";
import type { AdminEmployerVerificationStatus } from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";
import type {
  PendingEmployerListParams,
  RejectEmployerPayload,
} from "@/types/admin-employer-verification";

export function usePendingEmployers(filters: PendingEmployerListParams) {
  return useQuery({
    queryKey: pendingEmployerQueryKeys.list(filters),
    queryFn: () => getPendingEmployers(filters),
  });
}

export function usePendingEmployer(employerId: string) {
  return useQuery({
    queryKey: pendingEmployerQueryKeys.detail(employerId),
    queryFn: () => getPendingEmployerDetails(employerId),
    enabled: Boolean(employerId),
  });
}

export function usePendingEmployerMutations(employerId?: string) {
  const queryClient = useQueryClient();

  const invalidateEmployerQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: pendingEmployerQueryKeys.lists });
    await queryClient.invalidateQueries({ queryKey: pendingEmployerQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: adminEmployerQueryKeys.lists });
    await queryClient.invalidateQueries({ queryKey: adminEmployerQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.userLists });
    await queryClient.invalidateQueries({ queryKey: adminDashboardQueryKeys.dashboard });

    if (employerId) {
      await queryClient.invalidateQueries({
        queryKey: pendingEmployerQueryKeys.detail(employerId),
      });
      await queryClient.invalidateQueries({
        queryKey: adminEmployerQueryKeys.detail(employerId),
      });
    }
  };

  const verificationMutation = useMutation({
    mutationFn: ({
      targetEmployerId,
      verificationStatus,
    }: {
      targetEmployerId: string;
      verificationStatus: AdminEmployerVerificationStatus;
    }) => updatePendingEmployerVerification(targetEmployerId, verificationStatus),
    onSuccess: invalidateEmployerQueries,
  });

  const rejectionMutation = useMutation({
    mutationFn: ({
      targetEmployerId,
      payload,
    }: {
      targetEmployerId: string;
      payload: RejectEmployerPayload;
    }) => rejectPendingEmployer(targetEmployerId, payload),
    onSuccess: invalidateEmployerQueries,
  });

  const accountStatusMutation = useMutation({
    mutationFn: ({
      ownerUserId,
      status,
    }: {
      ownerUserId: string;
      status: AdminUserStatus;
    }) => updatePendingEmployerAccountStatus(ownerUserId, status),
    onSuccess: invalidateEmployerQueries,
  });

  return {
    verificationMutation,
    rejectionMutation,
    accountStatusMutation,
    invalidateEmployerQueries,
  };
}
