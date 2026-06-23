import type { RequestHandler } from "express";

import {
  applicationCreateSchema,
  applicationIdParamsSchema,
  applicationsQuerySchema,
} from "../validations/application.validation.js";
import {
  applyForJob,
  getMyApplicationDetails,
  getMyApplications,
  withdrawMyApplication,
} from "../services/application.service.js";
import { getAuthenticatedJobSeeker } from "../services/jobSeeker.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { handleControllerError } from "./controllerError.js";

export const createApplication: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const payload = applicationCreateSchema.parse(req.body);
    const application = await applyForJob(jobSeeker, payload);
    successResponse(res, "Application submitted successfully", application, 201);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getMyAppliedJobs: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const query = applicationsQuerySchema.parse(req.query);
    const result = await getMyApplications(jobSeeker, query);
    successResponse(res, "Applications fetched successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getApplicationDetails: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = applicationIdParamsSchema.parse(req.params);
    const application = await getMyApplicationDetails(jobSeeker, params.applicationId);
    successResponse(res, "Application details fetched successfully", application);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const withdrawApplication: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = applicationIdParamsSchema.parse(req.params);
    const application = await withdrawMyApplication(jobSeeker, params.applicationId);
    successResponse(res, "Application withdrawn successfully", application);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
