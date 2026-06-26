import type { AdminMeta, AdminUser } from "@/types/admin.types";

export type AdminApplicationStatus =
  | "applied"
  | "submitted"
  | "under_review"
  | "in_review"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "interview_scheduled"
  | "offered"
  | "hired"
  | "rejected"
  | "withdrawn"
  | "approved"
  | "pending"
  | "flagged"
  | "blocked";

export type AdminInterviewStatus =
  | "not_scheduled"
  | "scheduled"
  | "completed"
  | "cancelled";

export type AdminResumeStatus = "uploaded" | "missing" | "active";
export type AdminApplicationsTab = "all" | "new" | "flagged" | "advanced";
export type AdminApplicationsSortBy =
  | "newest"
  | "oldest"
  | "applicant_name_asc"
  | "applicant_name_desc"
  | "recently_updated";

export type AdminApplicationFilters = {
  search?: string;
  tab?: AdminApplicationsTab;
  status?: AdminApplicationStatus | "all";
  interviewStatus?: AdminInterviewStatus | "all";
  resumeStatus?: AdminResumeStatus | "all";
  company?: string;
  employer?: string;
  job?: string;
  dateFrom?: string;
  dateTo?: string;
  matchScore?: string;
  sortBy?: AdminApplicationsSortBy;
  page?: number;
  limit?: number;
};

export type AdminApplicationListParams = {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type AdminApplicationJob = {
  _id?: string;
  title?: string;
  companyName?: string;
  companyId?: string | AdminApplicationCompany;
};

export type AdminApplicationCompany = {
  _id?: string;
  name?: string;
  companyName?: string;
  logo?: string;
  logoUrl?: string;
};

export type AdminApplicationEmployer = Pick<
  AdminUser,
  "_id" | "name" | "email" | "avatar" | "photoURL" | "status"
>;

export type AdminApplicationApplicant = Pick<
  AdminUser,
  "_id" | "name" | "email" | "avatar" | "photoURL" | "status"
>;

export type AdminApplicationRecord = {
  _id: string;
  jobId?: string | AdminApplicationJob;
  companyId?: string | AdminApplicationCompany;
  applicantId?: string | AdminApplicationApplicant;
  employerId?: string | AdminApplicationEmployer;
  applicantName?: string;
  applicantEmail?: string;
  applicantAvatar?: string;
  resume?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: AdminApplicationStatus | string;
  matchScore?: number;
  resumeStatus?: AdminResumeStatus;
  interviewStatus?: AdminInterviewStatus;
  interviewScheduledAt?: string;
  timeline?: Array<{
    status?: string;
    note?: string;
    createdAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminApplicationsResponse = {
  applications: AdminApplicationRecord[];
  meta: AdminMeta;
};

export type AdminApplicationStats = {
  totalApplications: number;
  pendingReview: number;
  hiredThisMonth: number;
  suspiciousActivity: number;
};

export type AdminApplicationUpdatePayload = {
  status: AdminApplicationStatus;
  note?: string;
};
