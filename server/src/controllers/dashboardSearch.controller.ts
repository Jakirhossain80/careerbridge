import type { RequestHandler } from "express";
import { ZodError } from "zod";

import { searchDashboard } from "../services/dashboardSearch.service.js";
import AppError from "../utils/AppError.js";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "../utils/apiResponse.js";
import { dashboardSearchQuerySchema } from "../validations/dashboardSearch.validation.js";

export const dashboardSearch: RequestHandler = async (req, res, next) => {
  try {
    const query = dashboardSearchQuerySchema.parse(req.query);
    const result = await searchDashboard(req.user, query);
    successResponse(res, "Dashboard search completed successfully", result);
  } catch (error) {
    if (error instanceof ZodError) {
      validationErrorResponse(
        res,
        error.issues.map((issue) => ({
          field: issue.path.join(".") || "query",
          message: issue.message,
        })),
      );
      return;
    }
    if (error instanceof AppError) {
      errorResponse(res, error.message, null, error.statusCode);
      return;
    }
    next(error);
  }
};
