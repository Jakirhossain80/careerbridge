"use client";

import {
  approveAdminEmployer,
  getAdminEmployer,
  rejectAdminEmployer,
  updateAdminEmployer,
  updateUserStatus,
} from "@/services/admin.service";
import { api } from "@/lib/api";
import type {
  AdminEmployer,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";
import type {
  PendingEmployerListParams,
  PendingEmployersResponse,
  RejectEmployerPayload,
} from "@/types/admin-employer-verification";

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

function toApiVerificationStatus(status: AdminEmployerVerificationStatus) {
  if (status === "verified") return "approved";
  if (status === "pending_verification" || status === "unverified") {
    return "pending";
  }

  return status;
}

export const pendingEmployerQueryKeys = {
  lists: ["pending-employers"] as const,
  list: (filters: PendingEmployerListParams) =>
    ["pending-employers", filters] as const,
  stats: ["admin-pending-employer-stats"] as const,
  detail: (employerId: string) => ["admin-pending-employer", employerId] as const,
};

export async function getPendingEmployers(params: PendingEmployerListParams = {}) {
  const response = await api.get<
    ApiEnvelope<PendingEmployersResponse> | PendingEmployersResponse
  >("/admin/employers/pending", { params });

  return unwrap<PendingEmployersResponse>(response);
}

export async function getPendingEmployerDetails(employerId: string) {
  return getAdminEmployer(employerId) as Promise<AdminEmployer>;
}

export async function updatePendingEmployerVerification(
  employerId: string,
  verificationStatus: AdminEmployerVerificationStatus,
) {
  const apiStatus = toApiVerificationStatus(verificationStatus);

  if (apiStatus === "approved") {
    return approveAdminEmployer(employerId) as Promise<AdminEmployer>;
  }

  if (apiStatus === "rejected") {
    return rejectAdminEmployer(employerId) as Promise<AdminEmployer>;
  }

  return updateAdminEmployer(employerId, {
    verificationStatus: apiStatus,
  }) as Promise<AdminEmployer>;
}

export async function rejectPendingEmployer(
  employerId: string,
  payload: RejectEmployerPayload,
) {
  const reason = [payload.reasonCategory, payload.reason]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(": ");

  return rejectAdminEmployer(employerId, reason) as Promise<AdminEmployer>;
}

export async function updatePendingEmployerAccountStatus(
  ownerUserId: string,
  status: AdminUserStatus,
) {
  return updateUserStatus(ownerUserId, status);
}
