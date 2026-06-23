import type { SortOrder } from "mongoose";

import Job from "../models/job.model.js";
import SavedJob from "../models/savedJob.model.js";
import AppError from "../utils/AppError.js";
import type { AuthenticatedJobSeeker } from "./jobSeeker.service.js";
import type {
  SavedJobCreateInput,
  SavedJobsQueryInput,
} from "../validations/savedJob.validation.js";

const buildSort = (sortBy: string): Record<string, SortOrder> => {
  const direction = sortBy.startsWith("-") ? -1 : 1;
  return { [sortBy.replace(/^-/, "")]: direction };
};

const paginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

export const saveJob = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: SavedJobCreateInput
) => {
  const job = await Job.findById(input.jobId).select("_id");

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return SavedJob.findOneAndUpdate(
    { userId: jobSeeker.userId, jobId: input.jobId },
    { $setOnInsert: { userId: jobSeeker.userId, jobId: input.jobId } },
    { new: true, upsert: true, runValidators: true }
  );
};

export const getMySavedJobs = async (
  jobSeeker: AuthenticatedJobSeeker,
  query: SavedJobsQueryInput
) => {
  const skip = (query.page - 1) * query.limit;
  const filter = { userId: jobSeeker.userId };

  const [savedJobs, total] = await Promise.all([
    SavedJob.find(filter)
      .populate("jobId", "title companyName location jobType workMode salaryMin salaryMax currency deadline")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    SavedJob.countDocuments(filter),
  ]);

  return {
    savedJobs,
    meta: paginationMeta(query.page, query.limit, total),
  };
};

export const unsaveJob = async (
  jobSeeker: AuthenticatedJobSeeker,
  jobId: string
) => {
  const savedJob = await SavedJob.findOneAndDelete({
    userId: jobSeeker.userId,
    jobId,
  });

  if (!savedJob) {
    throw new AppError("Saved job not found", 404);
  }

  return savedJob;
};
