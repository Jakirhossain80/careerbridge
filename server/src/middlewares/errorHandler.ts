import type { ErrorRequestHandler, RequestHandler } from "express";
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
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Something went wrong";

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
