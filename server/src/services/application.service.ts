import type { SortOrder } from "mongoose";

import { APPLICATION_STATUS } from "../constants/model.constants.js";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import AppError from "../utils/AppError.js";
import type { AuthenticatedJobSeeker } from "./jobSeeker.service.js";
import type {
  ApplicationCreateInput,
  ApplicationsQueryInput,
} from "../validations/application.validation.js";

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

export const applyForJob = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: ApplicationCreateInput
) => {
  const existing = await Application.findOne({
    jobId: input.jobId,
    applicantId: jobSeeker.userId,
  });

  if (existing) {
    throw new AppError("You have already applied for this job.", 409);
  }

  const job = await Job.findById(input.jobId).select(
    "_id employerId companyId title companyName"
  );

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  let resumeName = input.resumeUrl ?? "External resume";
  let resumeUrl = input.resumeUrl;

  if (input.resumeId) {
    const resume = await Resume.findOne({
      _id: input.resumeId,
      jobSeekerId: jobSeeker.jobSeekerId,
    });

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    resumeName = resume.fileName;
    resumeUrl = resume.fileUrl;
  }

  const application = await Application.create({
    jobId: job._id,
    companyId: job.companyId,
    applicantId: jobSeeker.userId,
    applicantEmail: jobSeeker.email,
    applicantName: jobSeeker.name,
    employerId: job.employerId,
    resume: resumeName,
    resumeUrl,
    coverLetter: input.coverLetter,
    status: APPLICATION_STATUS.APPLIED,
    timeline: [
      {
        status: APPLICATION_STATUS.APPLIED,
        note: "Application submitted",
      },
    ],
  });

  await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

  return application;
};

export const getMyApplications = async (
  jobSeeker: AuthenticatedJobSeeker,
  query: ApplicationsQueryInput
) => {
  const filter: Record<string, unknown> = { applicantId: jobSeeker.userId };

  if (query.status) {
    filter.status = query.status;
  }

  const skip = (query.page - 1) * query.limit;
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("jobId", "title companyName location jobType workMode salaryMin salaryMax currency")
      .populate("companyId", "name companyName logo logoUrl")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    meta: paginationMeta(query.page, query.limit, total),
  };
};

export const getMyApplicationDetails = async (
  jobSeeker: AuthenticatedJobSeeker,
  applicationId: string
) => {
  const application = await Application.findOne({
    _id: applicationId,
    applicantId: jobSeeker.userId,
  })
    .populate("jobId", "title description companyName location jobType workMode salaryMin salaryMax currency deadline")
    .populate("companyId", "name companyName logo logoUrl website location")
    .lean();

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return application;
};

export const withdrawMyApplication = async (
  jobSeeker: AuthenticatedJobSeeker,
  applicationId: string
) => {
  const application = await Application.findOne({
    _id: applicationId,
    applicantId: jobSeeker.userId,
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.status === APPLICATION_STATUS.WITHDRAWN) {
    throw new AppError("Application is already withdrawn", 400);
  }

  application.status = APPLICATION_STATUS.WITHDRAWN;
  application.timeline.push({
    status: APPLICATION_STATUS.WITHDRAWN,
    note: "Application withdrawn by applicant",
  });
  await application.save();

  return application;
};
