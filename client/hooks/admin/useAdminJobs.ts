"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminJobQueryKeys,
  archiveAdminJob,
  getAdminJobDetails,
  getAdminJobList,
  getPendingAdminJobList,
  relatedAdminJobInvalidations,
  updateAdminJobApproval,
  updateAdminJobDetails,
  updateAdminJobStatus,
} from "@/services/admin-jobs.service";
import type {
  AdminJobApprovalStatus,
  AdminJobListParams,
  AdminJobStatus,
  AdminJobUpdatePayload,
} from "@/types/admin-job.types";

export function useAdminJobs(filters: AdminJobListParams) {
  return useQuery({
    queryKey: adminJobQueryKeys.list(filters),
    queryFn: () => getAdminJobList(filters),
  });
}

export function usePendingJobs(filters: AdminJobListParams) {
  return useQuery({
    queryKey: adminJobQueryKeys.pendingList(filters),
    queryFn: () => getPendingAdminJobList(filters),
  });
}

export function useAdminJob(jobId: string) {
  return useQuery({
    queryKey: adminJobQueryKeys.detail(jobId),
    queryFn: () => getAdminJobDetails(jobId),
    enabled: Boolean(jobId),
  });
}

export function useAdminJobMutations(jobId?: string) {
  const queryClient = useQueryClient();

  const invalidateJobQueries = async () => {
    await Promise.all(
      relatedAdminJobInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );

    if (jobId) {
      await queryClient.invalidateQueries({
        queryKey: adminJobQueryKeys.detail(jobId),
      });
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({
      targetJobId,
      payload,
    }: {
      targetJobId: string;
      payload: AdminJobUpdatePayload;
    }) => updateAdminJobDetails(targetJobId, payload),
    onSuccess: invalidateJobQueries,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      targetJobId,
      status,
    }: {
      targetJobId: string;
      status: AdminJobStatus;
    }) => updateAdminJobStatus(targetJobId, status),
    onSuccess: invalidateJobQueries,
  });

  const approvalMutation = useMutation({
    mutationFn: ({
      targetJobId,
      approvalStatus,
      reason,
    }: {
      targetJobId: string;
      approvalStatus: AdminJobApprovalStatus;
      reason?: string;
    }) => updateAdminJobApproval(targetJobId, approvalStatus, reason),
    onSuccess: invalidateJobQueries,
  });

  const archiveMutation = useMutation({
    mutationFn: ({ targetJobId }: { targetJobId: string }) =>
      archiveAdminJob(targetJobId),
    onSuccess: invalidateJobQueries,
  });

  return {
    updateMutation,
    statusMutation,
    approvalMutation,
    archiveMutation,
    invalidateJobQueries,
  };
}
