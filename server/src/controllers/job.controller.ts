import type { RequestHandler } from "express";
import { ZodError } from "zod";

import {
  publicJobIdentifierParamsSchema,
  publicJobsQuerySchema,
} from "../validations/job.validation.js";
import {
  getFeaturedPublicJobs,
  getPublicJobByIdentifier,
  getPublicJobs,
} from "../services/job.service.js";
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

export const listPublicJobs: RequestHandler = async (req, res, next) => {
  try {
    const query = publicJobsQuerySchema.parse(req.query);
    const result = await getPublicJobs(query);

    successResponse(res, "Public jobs fetched successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const listFeaturedPublicJobs: RequestHandler = async (req, res, next) => {
  try {
    const query = publicJobsQuerySchema.parse(req.query);
    const result = await getFeaturedPublicJobs(query);

    successResponse(res, "Featured jobs fetched successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getPublicJobDetails: RequestHandler = async (req, res, next) => {
  try {
    const params = publicJobIdentifierParamsSchema.parse(req.params);
    const job = await getPublicJobByIdentifier(params.idOrSlug);

    successResponse(res, "Public job fetched successfully", job);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
