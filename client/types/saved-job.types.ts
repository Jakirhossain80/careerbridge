export type SavedJob = {
  _id: string;
  userId?: string;
  jobSeekerId?: string;
  jobId:
    | string
    | {
        _id: string;
        title: string;
        companyName?: string;
        location?: string;
        jobType?: string;
        workMode?: string;
        salaryMin?: number;
        salaryMax?: number;
        currency?: string;
        deadline?: string;
      };
  savedAt?: string;
  createdAt?: string;
};

export type SavedJobsResponse = {
  savedJobs: SavedJob[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
