"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminJobSeekerQueryKeys,
  getAdminJobSeeker,
  getAdminJobSeekers,
  getAdminJobSeekerStats,
  updateAdminJobSeeker,
  updateAdminJobSeekerStatus,
} from "@/services/admin-job-seekers.service";
import { adminQueryKeys } from "@/services/admin.service";
import type {
  AdminJobSeekerListParams,
  AdminJobSeekerStatus,
  AdminJobSeekerUpdatePayload,
} from "@/types/admin-job-seeker.types";

export function useAdminJobSeekers(filters: AdminJobSeekerListParams) {
  return useQuery({
    queryKey: adminJobSeekerQueryKeys.list(filters),
    queryFn: () => getAdminJobSeekers(filters),
  });
}

export function useAdminJobSeekerStats() {
  return useQuery({
    queryKey: adminJobSeekerQueryKeys.stats,
    queryFn: getAdminJobSeekerStats,
  });
}

export function useAdminJobSeeker(jobSeekerId: string) {
  return useQuery({
    queryKey: adminJobSeekerQueryKeys.detail(jobSeekerId),
    queryFn: () => getAdminJobSeeker(jobSeekerId),
    enabled: Boolean(jobSeekerId),
  });
}

export function useAdminJobSeekerMutations(jobSeekerId?: string) {
  const queryClient = useQueryClient();

  const invalidateJobSeekerQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminJobSeekerQueryKeys.lists,
    });
    await queryClient.invalidateQueries({
      queryKey: adminJobSeekerQueryKeys.stats,
    });

    if (jobSeekerId) {
      await queryClient.invalidateQueries({
        queryKey: adminJobSeekerQueryKeys.detail(jobSeekerId),
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  const updateMutation = useMutation({
    mutationFn: ({
      targetJobSeekerId,
      payload,
    }: {
      targetJobSeekerId: string;
      payload: AdminJobSeekerUpdatePayload;
    }) => updateAdminJobSeeker(targetJobSeekerId, payload),
    onSuccess: invalidateJobSeekerQueries,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      targetJobSeekerId,
      status,
    }: {
      targetJobSeekerId: string;
      status: AdminJobSeekerStatus;
    }) => updateAdminJobSeekerStatus(targetJobSeekerId, status),
    onSuccess: invalidateJobSeekerQueries,
  });

  return {
    updateMutation,
    statusMutation,
    invalidateJobSeekerQueries,
  };
}
