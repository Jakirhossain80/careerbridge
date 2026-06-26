"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminBlogQueryKeys,
  createAdminBlogRecord,
  deleteAdminBlogRecord,
  getAdminBlogDetails,
  getAdminBlogList,
  getAdminBlogStats,
  relatedAdminBlogInvalidations,
  updateAdminBlogRecord,
  updateAdminBlogStatus,
} from "@/services/adminBlogService";
import type {
  AdminBlogFormValues,
  AdminBlogListParams,
  AdminBlogStatus,
} from "@/types/admin-blog";

export function useAdminBlogs(filters: AdminBlogListParams) {
  return useQuery({
    queryKey: adminBlogQueryKeys.list(filters),
    queryFn: () => getAdminBlogList(filters),
  });
}

export function useAdminBlog(blogId: string) {
  return useQuery({
    queryKey: adminBlogQueryKeys.detail(blogId),
    queryFn: () => getAdminBlogDetails(blogId),
    enabled: Boolean(blogId),
  });
}

export function useAdminBlogStats() {
  return useQuery({
    queryKey: adminBlogQueryKeys.stats,
    queryFn: getAdminBlogStats,
  });
}

export function useAdminBlogMutations() {
  const queryClient = useQueryClient();

  const invalidateBlogQueries = async () => {
    await Promise.all(
      relatedAdminBlogInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
  };

  const createMutation = useMutation({
    mutationFn: (values: AdminBlogFormValues) => createAdminBlogRecord(values),
    onSuccess: invalidateBlogQueries,
  });

  const updateMutation = useMutation({
    mutationFn: ({ blogId, values }: { blogId: string; values: AdminBlogFormValues }) =>
      updateAdminBlogRecord(blogId, values),
    onSuccess: invalidateBlogQueries,
  });

  const statusMutation = useMutation({
    mutationFn: ({ blogId, status }: { blogId: string; status: AdminBlogStatus }) =>
      updateAdminBlogStatus(blogId, status),
    onSuccess: invalidateBlogQueries,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ blogId }: { blogId: string }) => deleteAdminBlogRecord(blogId),
    onSuccess: invalidateBlogQueries,
  });

  return {
    createMutation,
    updateMutation,
    statusMutation,
    deleteMutation,
    invalidateBlogQueries,
  };
}
