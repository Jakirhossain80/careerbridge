export const USER_ROLES = {
  JOB_SEEKER: "job_seeker",
  EMPLOYER: "employer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  HR_MEMBER: "hr_member",
} as const;

export const USER_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
  BLOCKED: "blocked",
} as const;

export const COMPANY_VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  BLOCKED: "blocked",
} as const;

export const CATEGORY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const JOB_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  CLOSED: "closed",
  REJECTED: "rejected",
} as const;

export const JOB_TYPE = {
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

export const WORK_MODE = {
  ONSITE: "onsite",
  REMOTE: "remote",
  HYBRID: "hybrid",
} as const;

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  IN_REVIEW: "in_review",
  REVIEWING: "reviewing",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  OFFERED: "offered",
  REJECTED: "rejected",
  HIRED: "hired",
  WITHDRAWN: "withdrawn",
} as const;

export const INTERVIEW_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const NOTIFICATION_TYPE = {
  APPLICATION: "application",
  INTERVIEW: "interview",
  JOB: "job",
  ACCOUNT: "account",
  SYSTEM: "system",
} as const;

export const BLOG_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  UNPUBLISHED: "unpublished",
  ARCHIVED: "archived",
} as const;

export const REPORT_STATUS = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type CompanyVerificationStatus =
  (typeof COMPANY_VERIFICATION_STATUS)[keyof typeof COMPANY_VERIFICATION_STATUS];
export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];
export type WorkMode = (typeof WORK_MODE)[keyof typeof WORK_MODE];
export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
export type InterviewStatus =
  (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS];
export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
export type BlogStatus = (typeof BLOG_STATUS)[keyof typeof BLOG_STATUS];
export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];
