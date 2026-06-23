export type JobSeekerEducation = {
  degree?: string;
  institution?: string;
  graduationYear?: number;
};

export type JobSeekerExperience = {
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
};

export type JobSeekerProfile = {
  _id: string;
  userId: string;
  firebaseUid: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  headline?: string;
  about?: string;
  skills: string[];
  experienceLevel?: string;
  education: JobSeekerEducation[];
  experience: JobSeekerExperience[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  preferredJobTypes: string[];
  preferredWorkModes: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  createdAt: string;
  updatedAt: string;
};

export type Resume = {
  _id: string;
  jobSeekerId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isDefault: boolean;
  uploadedAt: string;
};

export type JobSeekerProfileInput = Partial<
  Omit<JobSeekerProfile, "_id" | "userId" | "firebaseUid" | "createdAt" | "updatedAt">
>;
