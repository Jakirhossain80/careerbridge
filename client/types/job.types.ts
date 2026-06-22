export type JobStatus =
  | "draft"
  | "pending"
  | "published"
  | "active"
  | "closed"
  | "archived"
  | "rejected";

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary"
  | "freelance";

export type WorkMode = "remote" | "onsite" | "hybrid";

export type JobVisibility = "public" | "private";

export type Job = {
  id: string;
  _id?: string;
  title: string;
  category: string;
  jobType: JobType;
  workMode?: WorkMode;
  workplaceType?: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  experienceLevel?: string;
  educationLevel?: string;
  vacancies?: number;
  openings?: number;
  deadline?: string;
  applicationDeadline?: string;
  skills: string[];
  description: string;
  responsibilities: string[] | string;
  requirements: string[] | string;
  benefits?: string[] | string;
  status: JobStatus;
  visibility?: JobVisibility;
  featured?: boolean;
  isPublished?: boolean;
  companyName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateJobPayload = {
  title: string;
  category: string;
  jobType: JobType;
  workplaceType: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceLevel?: string;
  educationLevel?: string;
  vacancies: number;
  deadline: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  status: JobStatus;
  featured: boolean;
};
