export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected"
  | "withdrawn";

export type DashboardMetricTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "neutral";

export interface JobSeekerDashboardMetric {
  label: string;
  value: number | string;
  tone?: DashboardMetricTone;
  icon?: string;
}

export interface JobSeekerRecentApplication {
  _id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface JobSeekerUpcomingInterview {
  _id: string;
  applicationId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  interviewType?: string;
  interviewDate: string;
  interviewTime: string;
  status: string;
}

export interface JobSeekerRecommendedJob {
  _id: string;
  slug?: string;
  title: string;
  companyName: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobSeekerDashboardNotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface JobSeekerDashboardData {
  profile: {
    fullName: string;
    email: string;
    avatar?: string;
    headline?: string;
    profileCompletion: number;
    resumeUploaded: boolean;
  };
  metrics: {
    totalApplied: number;
    activeApplications: number;
    savedJobs: number;
    interviews: number;
    jobAlerts: number;
    recommendedJobs: number;
  };
  recentApplications: JobSeekerRecentApplication[];
  upcomingInterviews: JobSeekerUpcomingInterview[];
  recommendedJobs: JobSeekerRecommendedJob[];
  notifications?: JobSeekerDashboardNotification[];
}

export type JobSeekerDashboardParams = {
  limit?: number;
  page?: number;
  search?: string;
};
