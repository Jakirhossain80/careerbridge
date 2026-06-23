export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export type JobSeekerApplicationStatus =
  | ApplicationStatus
  | "submitted"
  | "in_review"
  | "reviewing"
  | "withdrawn";

export type EmployerApplicationsSortBy = "matchScore" | "dateApplied" | "name";

export type EmployerApplicationsStatusFilter = ApplicationStatus | "all";

export type EmployerApplicationsQueryParams = {
  search?: string;
  status?: EmployerApplicationsStatusFilter;
  jobId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: EmployerApplicationsSortBy;
  page?: number;
  limit?: number;
};

export type EmployerApplicationsMeta = {
  totalShortlisted?: number;
  interviewsSet?: number;
  averageExperience?: number;
  diversityScore?: number;
};

export interface EmployerApplication {
  _id: string;
  applicationId?: string;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantAvatar?: string;
  location?: string;
  resumeUrl?: string;
  coverLetter?: string;
  skills?: string[];
  experienceYears?: number;
  summary?: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  matchScore?: number;
  status: ApplicationStatus;
  appliedAt: string;
  interviewScheduledAt?: string;
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
  meta?: EmployerApplicationsMeta;
};

export type ShortlistedApplicant = EmployerApplication & {
  status: "shortlisted" | ApplicationStatus;
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

export const jobSeekerApplicationStatusLabels: Record<
  JobSeekerApplicationStatus,
  string
> = {
  ...applicationStatusLabels,
  submitted: "Submitted",
  in_review: "In Review",
  reviewing: "Reviewing",
  withdrawn: "Withdrawn",
};

export type JobSeekerApplication = {
  _id: string;
  jobId:
    | string
    | {
        _id: string;
        title: string;
        description?: string;
        companyName?: string;
        location?: string;
        jobType?: string;
        workMode?: string;
        salaryMin?: number;
        salaryMax?: number;
        currency?: string;
        deadline?: string;
      };
  companyId?:
    | string
    | {
        _id: string;
        name?: string;
        companyName?: string;
        logo?: string;
        logoUrl?: string;
        website?: string;
        location?: string;
      };
  applicantId: string;
  resume?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: JobSeekerApplicationStatus;
  timeline?: Array<{
    status: JobSeekerApplicationStatus;
    note?: string;
    createdAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type ApplyJobPayload = {
  jobId: string;
  resumeId?: string;
  resumeUrl?: string;
  coverLetter?: string;
};

export type AppliedJobsResponse = {
  applications: JobSeekerApplication[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
