import JobAlert from "../models/jobAlert.model.js";
import AppError from "../utils/AppError.js";
import type { AuthenticatedJobSeeker } from "./jobSeeker.service.js";
import type {
  JobAlertCreateInput,
  JobAlertsQueryInput,
  JobAlertUpdateInput,
} from "../validations/jobAlert.validation.js";

const paginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

export const createJobAlert = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: JobAlertCreateInput
) => {
  return JobAlert.create({
    ...input,
    jobSeekerId: jobSeeker.jobSeekerId,
  });
};

export const getMyJobAlerts = async (
  jobSeeker: AuthenticatedJobSeeker,
  query: JobAlertsQueryInput
) => {
  const skip = (query.page - 1) * query.limit;
  const filter = { jobSeekerId: jobSeeker.jobSeekerId };
  const [jobAlerts, total] = await Promise.all([
    JobAlert.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
    JobAlert.countDocuments(filter),
  ]);

  return {
    jobAlerts,
    meta: paginationMeta(query.page, query.limit, total),
  };
};

export const updateJobAlert = async (
  jobSeeker: AuthenticatedJobSeeker,
  alertId: string,
  input: JobAlertUpdateInput
) => {
  const alert = await JobAlert.findOneAndUpdate(
    { _id: alertId, jobSeekerId: jobSeeker.jobSeekerId },
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!alert) {
    throw new AppError("Job alert not found", 404);
  }

  return alert;
};

export const deleteJobAlert = async (
  jobSeeker: AuthenticatedJobSeeker,
  alertId: string
) => {
  const alert = await JobAlert.findOneAndDelete({
    _id: alertId,
    jobSeekerId: jobSeeker.jobSeekerId,
  });

  if (!alert) {
    throw new AppError("Job alert not found", 404);
  }

  return alert;
};
