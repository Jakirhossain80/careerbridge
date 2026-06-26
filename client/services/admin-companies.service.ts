"use client";

import { api } from "@/lib/api";
import { adminQueryKeys } from "@/services/admin.service";
import type {
  AdminCompaniesResponse,
  AdminCompany,
  AdminCompanyListParams,
  AdminCompanyStats,
  AdminCompanyStatus,
  AdminCompanyUpdatePayload,
  AdminCompanyVerificationStatus,
} from "@/types/admin-company.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  const payload = response.data;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export const adminCompanyQueryKeys = {
  lists: ["admin-companies"] as const,
  list: (filters: AdminCompanyListParams) =>
    ["admin-companies", filters] as const,
  details: ["admin-company"] as const,
  detail: (companyId: string) => ["admin-company", companyId] as const,
  stats: ["admin-company-stats"] as const,
};

function toApiVerificationStatus(status: AdminCompanyVerificationStatus) {
  if (status === "verified") return "approved";
  if (
    status === "pending_verification" ||
    status === "under_review" ||
    status === "unverified"
  ) {
    return "pending";
  }

  return status;
}

export async function getAdminCompanyList(
  params: AdminCompanyListParams = {},
) {
  const response = await api.get<
    ApiEnvelope<AdminCompaniesResponse> | AdminCompaniesResponse
  >("/admin/companies", { params });
  return unwrap<AdminCompaniesResponse>(response);
}

export async function getAdminCompanyStats() {
  const response = await api.get<ApiEnvelope<AdminCompanyStats> | AdminCompanyStats>(
    "/admin/companies/stats",
  );
  return unwrap<AdminCompanyStats>(response);
}

export async function getAdminCompanyDetails(companyId: string) {
  const response = await api.get<ApiEnvelope<AdminCompany> | AdminCompany>(
    `/admin/companies/${companyId}`,
  );
  return unwrap<AdminCompany>(response);
}

export async function updateAdminCompanyDetails(
  companyId: string,
  payload: AdminCompanyUpdatePayload,
) {
  const response = await api.patch<ApiEnvelope<AdminCompany> | AdminCompany>(
    `/admin/companies/${companyId}`,
    payload,
  );
  return unwrap<AdminCompany>(response);
}

export async function updateAdminCompanyVerification(
  companyId: string,
  verificationStatus: AdminCompanyVerificationStatus,
) {
  const response = await api.patch<ApiEnvelope<AdminCompany> | AdminCompany>(
    `/admin/companies/${companyId}/verification`,
    { verificationStatus: toApiVerificationStatus(verificationStatus) },
  );
  return unwrap<AdminCompany>(response);
}

export async function updateAdminCompanyStatus(
  companyId: string,
  status: AdminCompanyStatus,
) {
  const response = await api.patch<ApiEnvelope<AdminCompany> | AdminCompany>(
    `/admin/companies/${companyId}/status`,
    { status },
  );
  return unwrap<AdminCompany>(response);
}

export const relatedAdminCompanyInvalidations = [
  adminCompanyQueryKeys.lists,
  adminCompanyQueryKeys.stats,
  adminQueryKeys.stats,
  ["admin-dashboard"] as const,
  ["admin-employers"] as const,
];
