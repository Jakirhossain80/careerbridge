export type EmployerJobStatus = "draft" | "published" | "closed" | "archived";

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
