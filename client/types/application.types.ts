export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export type EmployerApplicationsSortBy = "matchScore" | "dateApplied" | "name";

export type EmployerApplicationsStatusFilter = ApplicationStatus | "all";

export type EmployerApplicationsQueryParams = {
  search?: string;
  status?: EmployerApplicationsStatusFilter;
  sortBy?: EmployerApplicationsSortBy;
  page?: number;
  limit?: number;
};

export interface EmployerApplication {
  _id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar?: string;
  resumeUrl?: string;
  coverLetter?: string;
  skills?: string[];
  experienceYears?: number;
  matchScore?: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export type EmployerApplicationsResponse = {
  applications: EmployerApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdateApplicationStatusPayload = {
  applicationId: string;
  status: ApplicationStatus;
};
