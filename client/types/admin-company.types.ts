import type { AdminMeta, AdminUser, AdminUserStatus } from "@/types/admin.types";

export type AdminCompanyVerificationStatus =
  | "verified"
  | "pending_verification"
  | "under_review"
  | "rejected"
  | "unverified"
  | "approved"
  | "pending"
  | "blocked";

export type AdminCompanyStatus = AdminUserStatus;

export type AdminCompanySortBy =
  | "newest"
  | "oldest"
  | "company_name_asc"
  | "company_name_desc"
  | "recently_updated"
  | "most_active";

export type AdminCompanyFilters = {
  search?: string;
  verificationStatus?: AdminCompanyVerificationStatus | "all";
  companyStatus?: AdminCompanyStatus | "all";
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminCompanySortBy;
};

export type AdminCompanyListParams = {
  search?: string;
  verificationStatus?: string;
  companyStatus?: AdminCompanyStatus;
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type AdminCompany = {
  _id: string;
  ownerId?: AdminUser | string | null;
  ownerEmail?: string;
  slug?: string;
  name: string;
  companyName?: string;
  logo?: string;
  logoUrl?: string;
  banner?: string;
  bannerUrl?: string;
  industry?: string;
  size?: string;
  companySize?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  location?: string;
  headquarters?: string;
  about?: string;
  description?: string;
  benefits?: string[];
  socialLinks?: Record<string, string>;
  verificationStatus?: AdminCompanyVerificationStatus;
  status?: AdminCompanyVerificationStatus;
  companyStatus?: AdminCompanyStatus;
  activeJobsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCompaniesResponse = {
  companies: AdminCompany[];
  meta: AdminMeta;
};

export type AdminCompanyStats = {
  totalCompanies?: number;
  pendingVerification?: number;
  activeJobListings?: number;
  flaggedProfiles?: number;
};

export type AdminCompanyUpdatePayload = Partial<
  Pick<
    AdminCompany,
    | "name"
    | "companyName"
    | "industry"
    | "size"
    | "companySize"
    | "website"
    | "email"
    | "phone"
    | "location"
    | "headquarters"
    | "address"
    | "description"
    | "about"
    | "verificationStatus"
  >
>;
