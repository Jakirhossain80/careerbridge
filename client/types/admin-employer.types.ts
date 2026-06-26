import type { AdminMeta, AdminUser, AdminUserStatus } from "@/types/admin.types";

export type AdminEmployerAccountStatus = AdminUserStatus;

export type AdminEmployerVerificationStatus =
  | "verified"
  | "pending_verification"
  | "rejected"
  | "unverified"
  | "approved"
  | "pending"
  | "blocked";

export type AdminEmployerSortBy =
  | "newest"
  | "oldest"
  | "company_name_asc"
  | "company_name_desc"
  | "recently_active"
  | "verification_status";

export type AdminEmployerFilters = {
  search?: string;
  accountStatus?: AdminEmployerAccountStatus | "all";
  verificationStatus?: AdminEmployerVerificationStatus | "all";
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminEmployerSortBy;
};

export type AdminEmployerListParams = {
  search?: string;
  status?: string;
  accountStatus?: AdminEmployerAccountStatus;
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type AdminEmployer = {
  _id: string;
  firebaseUid?: string;
  ownerId?: AdminUser | string | null;
  ownerEmail?: string;
  name: string;
  email?: string;
  avatar?: string;
  photoURL?: string;
  role?: "employer";
  status?: AdminEmployerVerificationStatus;
  verificationStatus?: AdminEmployerVerificationStatus;
  phone?: string;
  companyId?: string;
  companyName?: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  size?: string;
  companySize?: string;
  location?: string;
  headquarters?: string;
  description?: string;
  activeJobsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
};

export type AdminEmployersResponse = {
  employers: AdminEmployer[];
  meta: AdminMeta;
};

export type AdminEmployerStats = {
  totalEmployers?: number;
  verifiedAccounts?: number;
  pendingReview?: number;
  totalActiveJobs?: number;
};

export type AdminEmployerUpdatePayload = Partial<
  Pick<
    AdminEmployer,
    | "name"
    | "companyName"
    | "industry"
    | "size"
    | "companySize"
    | "website"
    | "location"
    | "headquarters"
    | "description"
    | "verificationStatus"
  >
>;
