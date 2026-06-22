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

export interface ApplicationNote {
  _id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  label: string;
  createdAt: string;
  note?: string;
}

export interface ApplicantDetails extends EmployerApplication {
  applicantPhone?: string;
  location?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  education?: string;
  careerSummary?: string;
  resumeFileName?: string;
  notes?: ApplicationNote[];
  statusHistory?: ApplicationStatusHistory[];
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

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected",
};
