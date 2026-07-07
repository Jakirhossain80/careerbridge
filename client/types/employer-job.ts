export type EmployerJobStatus =
  | "draft"
  | "published"
  | "active"
  | "inactive"
  | "closed"
  | "archived";

export type EmployerPostedJobStatus =
  | "active"
  | "inactive"
  | "draft"
  | "pending"
  | "published"
  | "closed"
  | "archived"
  | "rejected";

export type EmployerJobVisibility = "public" | "private";

export type EmployerJobFormData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  jobType: string;
  workMode: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  experienceLevel: string;
  educationLevel: string;
  skills: string[];
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  applicationDeadline: string;
  vacancies: number;
  hiringUrgency: string;
  applicationMethod: string;
  externalApplicationUrl: string;
  status: EmployerJobStatus;
  publishedAt: string | null;
  employerId: string;
  companyId: string;
};

export type EmployerJobCompany = {
  id: string;
  name: string;
  logoInitials: string;
  industry: string;
  location: string;
};

export type EmployerPostedJob = {
  id: string;
  title: string;
  slug: string;
  category: string;
  jobType: string;
  workMode: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  applicantsCount: number;
  newApplicantsCount: number;
  viewsCount: number;
  postedDate: string | null;
  expirationDate: string | null;
  status: EmployerPostedJobStatus;
  visibility: EmployerJobVisibility;
  employerId: string;
  companyId: string;
};
