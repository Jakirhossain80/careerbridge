import type { AdminMeta, AdminUser } from "@/types/admin.types";

export type AdminJobStatus =
  | "draft"
  | "pending"
  | "active"
  | "published"
  | "expired"
  | "archived"
  | "closed"
  | "rejected";

export type AdminJobApprovalStatus =
  | "pending_review"
  | "approved"
  | "rejected";

export type AdminJobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary"
  | "freelance";

export type AdminJobWorkMode = "remote" | "onsite" | "hybrid";
export type AdminJobVisibility = "public" | "hidden" | "flagged" | "private";

export type AdminJobSortBy =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "most_applications"
  | "least_applications"
  | "recently_updated";

export type AdminJobFilters = {
  search?: string;
  status?: AdminJobStatus | "all";
  approvalStatus?: AdminJobApprovalStatus | "all";
  category?: string;
  jobType?: AdminJobType | "all";
  workMode?: AdminJobWorkMode | "all";
  experienceLevel?: string;
  company?: string;
  employer?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminJobSortBy;
};

export type AdminJobListParams = {
  search?: string;
  status?: AdminJobStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type AdminJobCompany = {
  _id: string;
  name?: string;
  companyName?: string;
  logo?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  verificationStatus?: string;
};

export type AdminJobEmployer = Pick<
  AdminUser,
  "_id" | "name" | "email" | "avatar" | "status"
>;

export type AdminJob = {
  _id: string;
  companyId?: string | AdminJobCompany;
  employerId?: string | AdminJobEmployer;
  employerEmail?: string;
  companyName?: string;
  slug?: string;
  title: string;
  category?: string;
  industry?: string;
  jobType?: AdminJobType;
  workMode?: AdminJobWorkMode;
  workplaceType?: AdminJobWorkMode;
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    negotiable?: boolean;
  };
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  experienceLevel?: string;
  educationLevel?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  deadline?: string;
  applicationDeadline?: string;
  vacancies?: number;
  openings?: number;
  status: AdminJobStatus;
  approvalStatus?: AdminJobApprovalStatus;
  applicationsCount?: number;
  applicationCount?: number;
  visibility?: AdminJobVisibility;
  featured?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminJobsResponse = {
  jobs: AdminJob[];
  meta: AdminMeta;
};

export type AdminJobStats = {
  totalJobs?: number;
  activeJobs?: number;
  pendingReview?: number;
  rejectedJobs?: number;
  archivedJobs?: number;
  totalApplications?: number;
};

export type AdminJobUpdatePayload = Partial<
  Pick<
    AdminJob,
    | "title"
    | "description"
    | "category"
    | "industry"
    | "location"
    | "status"
    | "featured"
  >
>;
