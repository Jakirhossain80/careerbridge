import type { RequestHandler } from "express";

import {
  jobIdParamsSchema,
  savedJobCreateSchema,
  savedJobsQuerySchema,
} from "../validations/savedJob.validation.js";
import { getAuthenticatedJobSeeker } from "../services/jobSeeker.service.js";
import {
  getMySavedJobs,
  saveJob,
  unsaveJob,
} from "../services/savedJob.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { handleControllerError } from "./controllerError.js";

export const createSavedJob: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const payload = savedJobCreateSchema.parse(req.body);
    const savedJob = await saveJob(jobSeeker, payload);
    successResponse(res, "Job saved successfully", savedJob, 201);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getSavedJobs: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const query = savedJobsQuerySchema.parse(req.query);
    const result = await getMySavedJobs(jobSeeker, query);
    successResponse(res, "Saved jobs fetched successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const deleteSavedJob: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = jobIdParamsSchema.parse(req.params);
    const savedJob = await unsaveJob(jobSeeker, params.jobId);
    successResponse(res, "Saved job removed successfully", savedJob);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
