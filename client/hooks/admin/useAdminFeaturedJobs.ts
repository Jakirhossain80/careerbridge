"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminFeaturedJobQueryKeys,
  featureAdminJob,
  getAdminFeaturedJobs,
  getAdminFeaturedJobStats,
  getFeatureCandidateJobs,
  relatedAdminFeaturedJobInvalidations,
  removeFeaturedAdminJob,
  updateFeaturedAdminJob,
} from "@/services/adminFeaturedJobService";
import type {
  AdminFeaturedJobListParams,
  FeatureJobPayload,
  UpdateFeaturedJobPayload,
} from "@/types/admin-featured-job";
import { publicJobQueryKeys } from "@/services/jobs.service";

export function useAdminFeaturedJobs(filters: AdminFeaturedJobListParams) {
  return useQuery({
    queryKey: adminFeaturedJobQueryKeys.list(filters),
    queryFn: () => getAdminFeaturedJobs(filters),
  });
}

export function useAdminFeaturedJobStats() {
  return useQuery({
    queryKey: adminFeaturedJobQueryKeys.stats,
    queryFn: getAdminFeaturedJobStats,
  });
}

export function useFeatureCandidateJobs(filters: AdminFeaturedJobListParams) {
  return useQuery({
    queryKey: adminFeaturedJobQueryKeys.availableJobs(filters),
    queryFn: () => getFeatureCandidateJobs(filters),
  });
}

export function useAdminFeaturedJobMutations() {
  const queryClient = useQueryClient();

  const invalidateFeaturedJobs = async () => {
    await Promise.all(
      relatedAdminFeaturedJobInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
    await queryClient.invalidateQueries({ queryKey: publicJobQueryKeys.all });
  };

  const featureMutation = useMutation({
    mutationFn: (payload: FeatureJobPayload) => featureAdminJob(payload),
    onSuccess: invalidateFeaturedJobs,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      promotionId,
      payload,
    }: {
      promotionId: string;
      payload: UpdateFeaturedJobPayload;
    }) => updateFeaturedAdminJob(promotionId, payload),
    onSuccess: invalidateFeaturedJobs,
  });

  const removeMutation = useMutation({
    mutationFn: ({ promotionId }: { promotionId: string }) =>
      removeFeaturedAdminJob(promotionId),
    onSuccess: invalidateFeaturedJobs,
  });

  return {
    featureMutation,
    updateMutation,
    removeMutation,
    invalidateFeaturedJobs,
  };
}
