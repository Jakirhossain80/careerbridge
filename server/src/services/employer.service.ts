import type { DecodedIdToken } from "firebase-admin/auth";
import type { SortOrder } from "mongoose";

import {
  APPLICATION_STATUS,
  COMPANY_VERIFICATION_STATUS,
  JOB_STATUS,
  type JobStatus,
} from "../constants/model.constants.js";
import AppError from "../utils/AppError.js";
import Application, { type IApplication } from "../models/application.model.js";
import Company, { type ICompany } from "../models/company.model.js";
import Job, { type IJob } from "../models/job.model.js";
import User from "../models/user.model.js";
import { uploadImageBuffer } from "../utils/imageUpload.js";
import {
  notifyApplicationStatusChanged,
  notifyMatchingJobAlertsForJob,
} from "./notification.service.js";
import type {
  ApplicationStatusUpdateInput,
  AuthenticatedEmployer,
  CompanyCreateInput,
  CompanyUpdateInput,
  EmployerApplicantsQuery,
  EmployerJobsQuery,
  JobCreateInput,
  JobUpdateInput,
  PaginationMeta,
} from "../types/employer.types.js";

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const buildSort = (sort: string): Record<string, SortOrder> => {
  const direction = sort.startsWith("-") ? -1 : 1;
  const field = sort.replace(/^-/, "");

  return { [field]: direction };
};

const getPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const isVisibleJobStatus = (status: JobStatus) =>
  status === JOB_STATUS.ACTIVE || status === JOB_STATUS.PUBLISHED;

const generateUniqueSlug = async (
  model: { exists: (filter: Record<string, unknown>) => Promise<unknown> },
  baseValue: string
) => {
  const baseSlug = slugify(baseValue);
  let slug = baseSlug || "careerbridge";
  let suffix = 1;

  while (await model.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

export const getAuthenticatedEmployer = async (
  firebaseUser?: DecodedIdToken
): Promise<AuthenticatedEmployer> => {
  if (!firebaseUser) {
    throw new AppError("Unauthorized: missing Firebase user", 401);
  }

  if (!firebaseUser.email) {
    throw new AppError("Firebase user email is required", 400);
  }

  const user = await User.findOne({
    $or: [
      { firebaseUid: firebaseUser.uid },
      { email: firebaseUser.email.toLowerCase() },
    ],
  }).select("_id firebaseUid email");

  if (!user) {
    throw new AppError("User profile not found. Sync the Firebase user first.", 404);
  }

  return {
    userId: user._id.toString(),
    email: user.email,
    firebaseUid: user.firebaseUid,
  };
};

export const createCompanyProfile = async (
  employer: AuthenticatedEmployer,
  input: CompanyCreateInput
) => {
  const existingCompany = await Company.findOne({ ownerId: employer.userId });

  if (existingCompany) {
    throw new AppError("Company profile already exists for this employer", 409);
  }

  const slug = await generateUniqueSlug(Company, input.companyName);

  return Company.create({
    ownerId: employer.userId,
    ownerEmail: employer.email,
    name: input.companyName,
    companyName: input.companyName,
    slug,
    industry: input.industry,
    size: input.companySize,
    companySize: input.companySize,
    website: input.website,
    location: input.headquarters,
    headquarters: input.headquarters,
    tagline: input.tagline,
    description: input.description,
    logo: input.logoUrl,
    logoUrl: input.logoUrl,
    banner: input.bannerUrl,
    bannerUrl: input.bannerUrl,
    socialLinks: input.socialLinks,
    status: COMPANY_VERIFICATION_STATUS.PENDING,
    verificationStatus: COMPANY_VERIFICATION_STATUS.PENDING,
  });
};

export const getMyCompanyProfile = async (employer: AuthenticatedEmployer) => {
  const company = await Company.findOne({ ownerId: employer.userId });

  return company;
};

export const updateCompanyProfile = async (
  employer: AuthenticatedEmployer,
  input: CompanyUpdateInput
) => {
  const update: Partial<ICompany> = {};

  if (input.companyName) {
    update.name = input.companyName;
    update.companyName = input.companyName;
  }

  if (input.industry !== undefined) update.industry = input.industry;
  if (input.companySize !== undefined) {
    update.size = input.companySize;
    update.companySize = input.companySize;
  }
  if (input.website !== undefined) update.website = input.website;
  if (input.headquarters !== undefined) {
    update.location = input.headquarters;
    update.headquarters = input.headquarters;
  }
  if (input.description !== undefined) update.description = input.description;
  if (input.tagline !== undefined) update.tagline = input.tagline;
  if (input.logoUrl !== undefined) {
    update.logo = input.logoUrl;
    update.logoUrl = input.logoUrl;
  }
  if (input.bannerUrl !== undefined) {
    update.banner = input.bannerUrl;
    update.bannerUrl = input.bannerUrl;
  }
  if (input.socialLinks !== undefined) update.socialLinks = input.socialLinks;

  const company = await Company.findOneAndUpdate(
    { ownerId: employer.userId },
    { $set: update },
    { returnDocument: "after", runValidators: true }
  );

  if (!company) {
    throw new AppError("Company profile not found", 404);
  }

  return company;
};

export const uploadCompanyBrandingImage = async (
  employer: AuthenticatedEmployer,
  file: Express.Multer.File,
  imageType: "logo" | "banner"
) => {
  const isLogo = imageType === "logo";
  const uploadResult = await uploadImageBuffer(file.buffer, {
    folder: isLogo
      ? "careerbridge/company-logos"
      : "careerbridge/company-banners",
    publicId: `${employer.firebaseUid}-${imageType}-${Date.now()}`,
    transformation: isLogo
      ? [
          { width: 512, height: 512, crop: "fill" },
          { quality: "auto", fetch_format: "auto" },
        ]
      : [
          { width: 1440, height: 420, crop: "fill" },
          { quality: "auto", fetch_format: "auto" },
        ],
  });

  const update: Partial<ICompany> = isLogo
    ? { logo: uploadResult.secure_url, logoUrl: uploadResult.secure_url }
    : { banner: uploadResult.secure_url, bannerUrl: uploadResult.secure_url };

  const company = await Company.findOneAndUpdate(
    { ownerId: employer.userId },
    { $set: update },
    { returnDocument: "after", runValidators: true }
  );

  if (!company) {
    throw new AppError("Company profile not found", 404);
  }

  return company;
};

const getApprovedCompanyForEmployer = async (
  employer: AuthenticatedEmployer
) => {
  const company = await Company.findOne({ ownerId: employer.userId });

  if (!company) {
    throw new AppError("Create a company profile before posting jobs", 404);
  }

  const companyStatus = company.status ?? company.verificationStatus;

  if (companyStatus !== COMPANY_VERIFICATION_STATUS.APPROVED) {
    throw new AppError("Company profile must be approved before posting jobs", 403);
  }

  return company;
};

export const createEmployerJob = async (
  employer: AuthenticatedEmployer,
  input: JobCreateInput
) => {
  const company = await getApprovedCompanyForEmployer(employer);
  const slug = await generateUniqueSlug(Job, `${company.name}-${input.title}`);

  const job = await Job.create({
    employerId: employer.userId,
    employerEmail: employer.email,
    companyId: company._id,
    companyName: company.companyName ?? company.name,
    title: input.title,
    slug,
    description: input.description,
    responsibilities: input.responsibilities,
    requirements: input.requirements,
    skills: input.skills,
    category: input.category,
    industry: input.industry ?? company.industry,
    salary: {
      min: input.salaryMin,
      max: input.salaryMax,
      currency: input.currency,
      negotiable: input.salaryMin === undefined && input.salaryMax === undefined,
    },
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    currency: input.currency,
    jobType: input.jobType as IJob["jobType"],
    workMode: input.workplaceType as IJob["workMode"],
    workplaceType: input.workplaceType as IJob["workplaceType"],
    location: input.location,
    deadline: input.deadline,
    experienceLevel: input.experienceLevel,
    vacancies: input.vacancies,
    status: input.status as IJob["status"],
    featured: input.featured,
    applicationsCount: 0,
  });

  if (isVisibleJobStatus(job.status)) {
    await notifyMatchingJobAlertsForJob(job._id);
  }

  return job;
};

export const updateEmployerJob = async (
  employer: AuthenticatedEmployer,
  jobId: string,
  input: JobUpdateInput
) => {
  const job = await Job.findOne({ _id: jobId, employerId: employer.userId });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.status === JOB_STATUS.ARCHIVED) {
    throw new AppError("Archived jobs cannot be updated", 400);
  }

  const update: Partial<IJob> = {};

  if (input.title !== undefined) update.title = input.title;
  if (input.description !== undefined) update.description = input.description;
  if (input.responsibilities !== undefined) {
    update.responsibilities = input.responsibilities;
  }
  if (input.requirements !== undefined) update.requirements = input.requirements;
  if (input.skills !== undefined) update.skills = input.skills;
  if (input.category !== undefined) update.category = input.category;
  if (input.industry !== undefined) update.industry = input.industry;
  if (input.salaryMin !== undefined) update.salaryMin = input.salaryMin;
  if (input.salaryMax !== undefined) update.salaryMax = input.salaryMax;
  if (input.currency !== undefined) update.currency = input.currency;
  if (
    input.salaryMin !== undefined ||
    input.salaryMax !== undefined ||
    input.currency !== undefined
  ) {
    update.salary = {
      min: input.salaryMin ?? job.salaryMin,
      max: input.salaryMax ?? job.salaryMax,
      currency: input.currency ?? job.currency,
      negotiable:
        (input.salaryMin ?? job.salaryMin) === undefined &&
        (input.salaryMax ?? job.salaryMax) === undefined,
    };
  }
  if (input.jobType !== undefined) {
    update.jobType = input.jobType as IJob["jobType"];
  }
  if (input.workplaceType !== undefined) {
    update.workMode = input.workplaceType as IJob["workMode"];
    update.workplaceType = input.workplaceType as IJob["workplaceType"];
  }
  if (input.location !== undefined) update.location = input.location;
  if (input.deadline !== undefined) update.deadline = input.deadline;
  if (input.experienceLevel !== undefined) {
    update.experienceLevel = input.experienceLevel;
  }
  if (input.vacancies !== undefined) update.vacancies = input.vacancies;
  if (input.status !== undefined) update.status = input.status as IJob["status"];
  if (input.featured !== undefined) update.featured = input.featured;

  const previousStatus = job.status;
  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, employerId: employer.userId },
    { $set: update },
    { returnDocument: "after", runValidators: true }
  );

  if (!updatedJob) {
    throw new AppError("Job not found", 404);
  }

  if (
    updatedJob.status !== previousStatus &&
    isVisibleJobStatus(updatedJob.status)
  ) {
    await notifyMatchingJobAlertsForJob(updatedJob._id);
  }

  return updatedJob;
};

export const archiveEmployerJob = async (
  employer: AuthenticatedEmployer,
  jobId: string
) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, employerId: employer.userId },
    { $set: { status: JOB_STATUS.ARCHIVED } },
    { returnDocument: "after", runValidators: true }
  );

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
};

export const getEmployerJobs = async (
  employer: AuthenticatedEmployer,
  query: EmployerJobsQuery
) => {
  const filter: Record<string, unknown> = {
    employerId: employer.userId,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { companyName: regex }, { location: regex }];
  }

  const skip = (query.page - 1) * query.limit;
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort(buildSort(query.sort))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const getJobApplicants = async (
  employer: AuthenticatedEmployer,
  jobId: string,
  query: EmployerApplicantsQuery
) => {
  const job = await Job.findOne({ _id: jobId, employerId: employer.userId })
    .select("_id")
    .lean();

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const filter: Record<string, unknown> = {
    jobId,
    employerId: employer.userId,
  };

  if (query.status) {
    filter.status = query.status;
  }

  const skip = (query.page - 1) * query.limit;
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("applicantId", "name email photoURL")
      .sort(buildSort(query.sort))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Application.countDocuments(filter),
  ]);

  return {
    applicants: applications,
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const updateApplicationStatus = async (
  employer: AuthenticatedEmployer,
  applicationId: string,
  input: ApplicationStatusUpdateInput
) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const job = await Job.findOne({
    _id: application.jobId,
    employerId: employer.userId,
  }).select("_id");

  if (!job) {
    throw new AppError("Application not found", 404);
  }

  application.status = input.status as IApplication["status"];
  application.timeline.push({
    status: input.status as IApplication["status"],
    updatedBy: application.employerId,
  });

  if (input.status === APPLICATION_STATUS.HIRED) {
    application.status = APPLICATION_STATUS.HIRED;
  }

  await application.save();
  await notifyApplicationStatusChanged(application._id.toString(), employer.userId);

  return application;
};
