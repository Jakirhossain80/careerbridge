export interface JobSeekerProfileExperience {
  _id?: string;
  title: string;
  company: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  location?: string;
  description?: string;
}

export interface JobSeekerProfileEducation {
  _id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  startYear?: number;
  endYear?: number;
}

export interface JobSeekerProfileProject {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string[];
}

export interface JobSeekerResumeSummary {
  _id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  isDefault?: boolean;
}

export interface JobSeekerProfileStats {
  appliedJobs: number;
  savedJobs: number;
  interviews: number;
  profileViews?: number;
}

export interface JobSeekerProfile {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  location?: string;
  joinedAt?: string;
  profileCompletion?: number;
  about?: string;
  yearsOfExperience?: number;
  currentDesignation?: string;
  preferredRole?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  experience?: JobSeekerProfileExperience[];
  education?: JobSeekerProfileEducation[];
  projects?: JobSeekerProfileProject[];
  resume?: JobSeekerResumeSummary;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  otherLinks?: Array<{
    label: string;
    url: string;
  }>;
  stats?: JobSeekerProfileStats;
}

export type JobSeekerProfileUpdatePayload = Partial<
  Omit<JobSeekerProfile, "_id" | "joinedAt" | "stats" | "resume">
>;
