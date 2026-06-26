"use client";

import {
  approveAdminEmployer,
  getAdminEmployer,
  getAdminEmployers,
  getAdminStats,
  rejectAdminEmployer,
  updateAdminEmployer,
  updateUserStatus,
} from "@/services/admin.service";
import type {
  AdminEmployer,
  AdminEmployerListParams,
  AdminEmployerStats,
  AdminEmployerVerificationStatus,
  AdminEmployersResponse,
  AdminEmployerUpdatePayload,
} from "@/types/admin-employer.types";
import type { AdminStats, AdminUserStatus } from "@/types/admin.types";

export const adminEmployerQueryKeys = {
  lists: ["admin-employers"] as const,
  list: (filters: AdminEmployerListParams) =>
    ["admin-employers", filters] as const,
  details: ["admin-employer"] as const,
  detail: (employerId: string) => ["admin-employer", employerId] as const,
  stats: ["admin-employer-stats"] as const,
};

function toApiVerificationStatus(status: AdminEmployerVerificationStatus) {
  if (status === "verified") return "approved";
  if (status === "pending_verification" || status === "unverified") {
    return "pending";
  }

  return status;
}

export async function getAdminEmployerList(
  params: AdminEmployerListParams = {},
) {
  return getAdminEmployers(params) as Promise<AdminEmployersResponse>;
}

export async function getAdminEmployerDetails(employerId: string) {
  return getAdminEmployer(employerId) as Promise<AdminEmployer>;
}

export async function getAdminEmployerStats() {
  const stats = (await getAdminStats()) as AdminStats;

  return {
    totalEmployers: stats.totalEmployers,
    pendingReview: stats.pendingEmployers,
    totalActiveJobs: stats.totalJobs,
  } satisfies AdminEmployerStats;
}

export async function updateAdminEmployerDetails(
  employerId: string,
  payload: AdminEmployerUpdatePayload,
) {
  return updateAdminEmployer(employerId, { ...payload }) as Promise<AdminEmployer>;
}

export async function updateAdminEmployerVerification(
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

export async function updateAdminEmployerAccountStatus(
  ownerUserId: string,
  status: AdminUserStatus,
) {
  return updateUserStatus(ownerUserId, status);
}
