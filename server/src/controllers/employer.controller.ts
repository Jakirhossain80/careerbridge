import type { RequestHandler } from "express";
import { ZodError } from "zod";

import {
  applicationIdParamsSchema,
  applicationStatusUpdateSchema,
  companyCreateSchema,
  companyUpdateSchema,
  employerApplicationsQuerySchema,
  employerSettingsSchema,
  employerApplicantsQuerySchema,
  employerJobsQuerySchema,
  jobCreateSchema,
  jobIdParamsSchema,
  jobUpdateSchema,
} from "../validations/employer.validation.js";
import {
  archiveEmployerJob,
  createCompanyProfile,
  createEmployerJob,
  getEmployerApplicationDetails,
  getEmployerApplications,
  getAuthenticatedEmployer,
  getEmployerJobs,
  getJobApplicants,
  getMyEmployerSettings,
  getMyCompanyProfile,
  updateApplicationStatus,
  updateCompanyProfile,
  updateEmployerJob,
  updateMyEmployerSettings,
  uploadCompanyBrandingImage,
} from "../services/employer.service.js";
import AppError from "../utils/AppError.js";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "../utils/apiResponse.js";

const formatZodIssues = (error: ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join(".") : "form",
    message: issue.message,
  }));

const handleControllerError = (
  error: unknown,
  res: Parameters<RequestHandler>[1],
  next: Parameters<RequestHandler>[2]
) => {
  if (error instanceof ZodError) {
    validationErrorResponse(res, formatZodIssues(error));
    return;
  }

  if (error instanceof AppError) {
    errorResponse(res, error.message, null, error.statusCode);
    return;
  }

  next(error);
};

export const createCompany: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const payload = companyCreateSchema.parse(req.body);
    const company = await createCompanyProfile(employer, payload);

    successResponse(res, "Company profile created successfully", company, 201);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getMyCompany: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const company = await getMyCompanyProfile(employer);

    successResponse(res, "Company profile fetched successfully", company, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateMyCompany: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const payload = companyUpdateSchema.parse(req.body);
    const company = await updateCompanyProfile(employer, payload);

    successResponse(res, "Company profile updated successfully", company, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getSettings: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const settings = await getMyEmployerSettings(employer);

    successResponse(res, "Employer settings fetched successfully", settings, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateSettings: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const payload = employerSettingsSchema.parse(req.body);
    const settings = await updateMyEmployerSettings(employer, payload);

    successResponse(res, "Employer settings updated successfully", settings, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const uploadCompanyImage = (
  imageType: "logo" | "banner"
): RequestHandler => async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const file = req.file;

    if (!file) {
      throw new AppError(`Company ${imageType} image is required`, 400);
    }

    const company = await uploadCompanyBrandingImage(employer, file, imageType);
    successResponse(res, `Company ${imageType} updated successfully`, company, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const uploadCompanyLogo = uploadCompanyImage("logo");
export const uploadCompanyBanner = uploadCompanyImage("banner");

export const createJob: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const payload = jobCreateSchema.parse(req.body);
    const job = await createEmployerJob(employer, payload);

    successResponse(res, "Job created successfully", job, 201);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateJob: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const params = jobIdParamsSchema.parse(req.params);
    const payload = jobUpdateSchema.parse(req.body);
    const job = await updateEmployerJob(employer, params.jobId, payload);

    successResponse(res, "Job updated successfully", job, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const archiveJob: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const params = jobIdParamsSchema.parse(req.params);
    const job = await archiveEmployerJob(employer, params.jobId);

    successResponse(res, "Job archived successfully", job, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getJobs: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const query = employerJobsQuerySchema.parse(req.query);
    const result = await getEmployerJobs(employer, query);

    successResponse(res, "Employer jobs fetched successfully", result, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getApplicants: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const params = jobIdParamsSchema.parse(req.params);
    const query = employerApplicantsQuerySchema.parse(req.query);
    const result = await getJobApplicants(employer, params.jobId, query);

    successResponse(res, "Job applicants fetched successfully", result, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getApplications: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const query = employerApplicationsQuerySchema.parse(req.query);
    const result = await getEmployerApplications(employer, query);

    successResponse(res, "Employer applications fetched successfully", result, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getApplicationDetails: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const params = applicationIdParamsSchema.parse(req.params);
    const application = await getEmployerApplicationDetails(
      employer,
      params.applicationId
    );

    successResponse(res, "Employer application details fetched successfully", application, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const employer = await getAuthenticatedEmployer(req.user);
    const params = applicationIdParamsSchema.parse(req.params);
    const payload = applicationStatusUpdateSchema.parse(req.body);
    const application = await updateApplicationStatus(
      employer,
      params.applicationId,
      payload
    );

    successResponse(res, "Application status updated successfully", application, 200);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
