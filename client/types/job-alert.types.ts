export type JobAlertFrequency = "daily" | "weekly";

export type JobAlert = {
  _id: string;
  jobSeekerId: string;
  title: string;
  keyword?: string;
  location?: string;
  category?: string;
  jobType?: string;
  workMode?: string;
  frequency: JobAlertFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type JobAlertInput = {
  title: string;
  keyword?: string;
  location?: string;
  category?: string;
  jobType?: string;
  workMode?: string;
  frequency: JobAlertFrequency;
  isActive?: boolean;
};
