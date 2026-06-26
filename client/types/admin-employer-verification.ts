import type {
  AdminEmployer,
  AdminEmployerListParams,
  AdminEmployerAccountStatus,
  AdminEmployerSortBy,
} from "@/types/admin-employer.types";
import type { AdminMeta } from "@/types/admin.types";

export type PendingEmployerVerificationStatus =
  | "pending_verification"
  | "under_review"
  | "approved"
  | "rejected"
  | "pending"
  | "blocked"
  | "verified"
  | "unverified";

export type EmployerChecklistStatus =
  | "verified"
  | "warning"
  | "failed"
  | "pending"
  | "missing";

export type EmployerVerificationChecklistItem = {
  key: string;
  label: string;
  status: EmployerChecklistStatus;
  message?: string;
};

export type PendingEmployer = AdminEmployer & {
  submittedAt?: string;
  address?: string;
  verificationChecklist?: EmployerVerificationChecklistItem[];
};

export type PendingEmployerFilters = {
  search?: string;
  accountStatus?: AdminEmployerAccountStatus | "all";
  verificationStatus?: PendingEmployerVerificationStatus | "all";
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  submittedFrom?: string;
  submittedTo?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminEmployerSortBy;
};

export type PendingEmployerListParams = AdminEmployerListParams & {
  verificationStatus?: string;
  submittedFrom?: string;
  submittedTo?: string;
};

export type PendingEmployerStats = {
  awaitingReview?: number;
  averageWaitTimeHours?: number;
  approvedThisMonth?: number;
  rejectionRate?: number;
};

export type PendingEmployersResponse = {
  employers: PendingEmployer[];
  meta: AdminMeta;
  stats?: PendingEmployerStats;
};

export type RejectEmployerPayload = {
  reasonCategory: string;
  reason: string;
};
