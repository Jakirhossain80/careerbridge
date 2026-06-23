import type { RequestHandler } from "express";
import { ZodError } from "zod";

import AppError from "../utils/AppError.js";
import { errorResponse } from "../utils/apiResponse.js";

export const handleControllerError = (
  error: unknown,
  res: Parameters<RequestHandler>[1],
  next: Parameters<RequestHandler>[2]
) => {
  if (error instanceof ZodError) {
    errorResponse(res, "Validation failed", error.issues, 400);
    return;
  }

  if (error instanceof AppError) {
    errorResponse(res, error.message, null, error.statusCode);
    return;
  }

  next(error);
};
