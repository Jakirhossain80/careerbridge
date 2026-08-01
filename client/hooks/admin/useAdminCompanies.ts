"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminCompanyQueryKeys,
  getAdminCompanyDetails,
  getAdminCompanyList,
  getAdminCompanyStats,
  relatedAdminCompanyInvalidations,
  updateAdminCompanyDetails,
  updateAdminCompanyStatus,
  updateAdminCompanyVerification,
} from "@/services/admin-companies.service";
import type {
  AdminCompanyListParams,
  AdminCompanyStatus,
  AdminCompanyUpdatePayload,
  AdminCompanyVerificationStatus,
} from "@/types/admin-company.types";
import { publicJobQueryKeys } from "@/services/jobs.service";

export function useAdminCompanies(filters: AdminCompanyListParams) {
  return useQuery({
    queryKey: adminCompanyQueryKeys.list(filters),
    queryFn: () => getAdminCompanyList(filters),
  });
}

export function useAdminCompanyStats() {
  return useQuery({
    queryKey: adminCompanyQueryKeys.stats,
    queryFn: getAdminCompanyStats,
  });
}

export function useAdminCompany(companyId: string) {
  return useQuery({
    queryKey: adminCompanyQueryKeys.detail(companyId),
    queryFn: () => getAdminCompanyDetails(companyId),
    enabled: Boolean(companyId),
  });
}

export function useAdminCompanyMutations(companyId?: string) {
  const queryClient = useQueryClient();

  const invalidateCompanyQueries = async () => {
    await Promise.all(
      relatedAdminCompanyInvalidations.map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );

    if (companyId) {
      await queryClient.invalidateQueries({
        queryKey: adminCompanyQueryKeys.detail(companyId),
      });
    }
    await queryClient.invalidateQueries({ queryKey: publicJobQueryKeys.all });
  };

  const updateMutation = useMutation({
    mutationFn: ({
      targetCompanyId,
      payload,
    }: {
      targetCompanyId: string;
      payload: AdminCompanyUpdatePayload;
    }) => updateAdminCompanyDetails(targetCompanyId, payload),
    onSuccess: invalidateCompanyQueries,
  });

  const verificationMutation = useMutation({
    mutationFn: ({
      targetCompanyId,
      verificationStatus,
    }: {
      targetCompanyId: string;
      verificationStatus: AdminCompanyVerificationStatus;
    }) => updateAdminCompanyVerification(targetCompanyId, verificationStatus),
    onSuccess: invalidateCompanyQueries,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      targetCompanyId,
      status,
    }: {
      targetCompanyId: string;
      status: AdminCompanyStatus;
    }) => updateAdminCompanyStatus(targetCompanyId, status),
    onSuccess: invalidateCompanyQueries,
  });

  return {
    updateMutation,
    verificationMutation,
    statusMutation,
    invalidateCompanyQueries,
  };
}
