import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

type ErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  stack?: string;
};

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = err instanceof AppError ? err.statusCode : 500;
  let message = err instanceof AppError ? err.message : "Something went wrong";

  if (err instanceof multer.MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file exceeds the allowed size"
        : "Invalid file upload request";
  } else if (
    err instanceof Error &&
    "type" in err &&
    err.type === "entity.too.large"
  ) {
    statusCode = 413;
    message = "Request body exceeds the allowed size";
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  const response: ErrorResponse = {
    success: false,
    statusCode,
    message,
  };

  if (env.nodeEnv !== "production" && err instanceof Error) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
