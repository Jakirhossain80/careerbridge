export type AdminRole = "job_seeker" | "employer" | "admin" | "super_admin";
export type AdminUserStatus = "active" | "pending" | "suspended" | "blocked";
export type AdminApprovalStatus = "pending" | "approved" | "rejected" | "blocked";
export type AdminJobStatus =
  | "draft"
  | "pending"
  | "active"
  | "published"
  | "archived"
  | "closed"
  | "rejected";
export type AdminReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type AdminBlogStatus = "draft" | "published" | "archived";
export type AdminCategoryStatus = "active" | "inactive";

export type AdminMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminListParams = {
  search?: string;
  role?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type AdminUser = {
  _id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  photoURL?: string;
  avatar?: string;
  role: AdminRole;
  status: AdminUserStatus;
  phone?: string;
  location?: string;
  headline?: string;
  company?: {
    _id?: string;
    name?: string;
    companyName?: string;
    industry?: string;
    location?: string;
    website?: string;
  } | null;
  skills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  experienceSummary?: string;
  educationSummary?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  otherLinks?: Array<{
    label: string;
    url: string;
  }>;
  profileCompleted?: boolean;
  stats?: {
    appliedJobsCount?: number;
    postedJobsCount?: number;
    savedJobsCount?: number;
    interviewCount?: number;
    profileCompletionPercentage?: number;
    profileViews?: number;
  };
  recentActivity?: Array<{
    id: string;
    action: string;
    details?: string;
    status?: string;
    timestamp?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
};

export type AdminEmployer = {
  _id: string;
  ownerId?: AdminUser;
  ownerEmail?: string;
  name: string;
  companyName?: string;
  industry?: string;
  location?: string;
  headquarters?: string;
  verificationStatus: AdminApprovalStatus;
  status?: AdminApprovalStatus;
  createdAt?: string;
};

export type AdminJob = {
  _id: string;
  title: string;
  companyName?: string;
  category?: string;
  location?: string;
  status: AdminJobStatus;
  applicationsCount?: number;
  createdAt?: string;
};

export type AdminApplication = {
  _id: string;
  applicantName?: string;
  applicantEmail?: string;
  status: string;
  jobId?: { title?: string; companyName?: string };
  createdAt?: string;
};

export type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  status: AdminCategoryStatus;
  createdAt?: string;
};

export type AdminBlog = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  content?: string;
  status: AdminBlogStatus;
  createdAt?: string;
};

export type AdminReport = {
  _id: string;
  reporterEmail?: string;
  targetType: string;
  reason: string;
  description?: string;
  status: AdminReportStatus;
  createdAt?: string;
};

export type AdminStats = {
  totalUsers: number;
  totalJobSeekers: number;
  totalEmployers: number;
  totalJobs: number;
  pendingJobs: number;
  totalApplications: number;
  pendingEmployers: number;
  reports: number;
  blockedUsers: number;
  recentActivity: Array<{
    id: string;
    type: string;
    label: string;
    status?: string;
    createdAt?: string;
  }>;
};

export type AdminListResponse<T> = {
  meta: AdminMeta;
} & Record<string, T[]>;
