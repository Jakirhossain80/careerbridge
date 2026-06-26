"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminCategoryQueryKeys,
  createAdminCategoryRecord,
  deleteAdminCategoryRecord,
  getAdminCategoryList,
  getAdminCategoryStats,
  relatedAdminCategoryInvalidations,
  updateAdminCategoryRecord,
  updateAdminCategoryStatus,
} from "@/services/adminCategoryService";
import type {
  AdminCategoryFormValues,
  AdminCategoryListParams,
  AdminCategoryStatus,
} from "@/types/admin-category";

export function useAdminCategories(filters: AdminCategoryListParams) {
  return useQuery({
    queryKey: adminCategoryQueryKeys.list(filters),
    queryFn: () => getAdminCategoryList(filters),
  });
}

export function useAdminCategoryStats() {
  return useQuery({
    queryKey: adminCategoryQueryKeys.stats,
    queryFn: getAdminCategoryStats,
  });
}

export function useAdminCategoryMutations() {
  const queryClient = useQueryClient();

  const invalidateCategoryQueries = async () => {
    await Promise.all(
      relatedAdminCategoryInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
  };

  const createMutation = useMutation({
    mutationFn: (values: AdminCategoryFormValues) =>
      createAdminCategoryRecord(values),
    onSuccess: invalidateCategoryQueries,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      categoryId,
      values,
    }: {
      categoryId: string;
      values: AdminCategoryFormValues;
    }) => updateAdminCategoryRecord(categoryId, values),
    onSuccess: invalidateCategoryQueries,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      categoryId,
      status,
    }: {
      categoryId: string;
      status: AdminCategoryStatus;
    }) => updateAdminCategoryStatus(categoryId, status),
    onSuccess: invalidateCategoryQueries,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ categoryId }: { categoryId: string }) =>
      deleteAdminCategoryRecord(categoryId),
    onSuccess: invalidateCategoryQueries,
  });

  return {
    createMutation,
    updateMutation,
    statusMutation,
    deleteMutation,
    invalidateCategoryQueries,
  };
}
