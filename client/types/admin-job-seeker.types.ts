import type { AdminMeta, AdminUserStatus } from "@/types/admin.types";

export type AdminJobSeekerStatus = AdminUserStatus;

export type AdminJobSeekerResumeStatus =
  | "uploaded"
  | "missing"
  | "processing"
  | "active";

export type AdminJobSeekerSortBy =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "profile_completion_high"
  | "profile_completion_low";

export type AdminJobSeekerProfileCompletionFilter =
  | "all"
  | "under_50"
  | "50_79"
  | "80_100"
  | "complete"
  | "incomplete";

export type AdminJobSeekerFilters = {
  search?: string;
  status?: AdminJobSeekerStatus | "all";
  resumeStatus?: AdminJobSeekerResumeStatus | "all";
  profileCompletion?: AdminJobSeekerProfileCompletionFilter;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminJobSeekerSortBy;
};

export type AdminJobSeekerListParams = {
  search?: string;
  status?: AdminJobSeekerStatus;
  resumeStatus?: AdminJobSeekerResumeStatus;
  profileCompletion?: Exclude<AdminJobSeekerProfileCompletionFilter, "all">;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type AdminJobSeekerResume = {
  _id?: string;
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  uploadedAt?: string;
};

export type AdminJobSeeker = {
  _id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  avatar?: string;
  photoURL?: string;
  role: "job_seeker";
  status: AdminJobSeekerStatus;
  phone?: string;
  location?: string;
  professionalHeadline?: string;
  profileCompletion?: number;
  resumeStatus?: AdminJobSeekerResumeStatus;
  resume?: AdminJobSeekerResume;
  skills?: string[];
  applicationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
};

export type AdminJobSeekersResponse = {
  jobSeekers: AdminJobSeeker[];
  meta: AdminMeta;
};

export type AdminJobSeekerStats = {
  totalJobSeekers: number;
  activeApplications: number;
  averageProfileCompletion: number;
  blockedAccounts: number;
};

export type AdminJobSeekerUpdatePayload = Partial<
  Pick<
    AdminJobSeeker,
    "name" | "status" | "phone" | "location" | "professionalHeadline"
  >
> & {
  photoURL?: string;
};
