import type { Response } from "express";

type ApiResponse<TData = unknown, TError = unknown> = {
  success: boolean;
  message: string;
  data: TData | null;
  error: TError | null;
};

export const successResponse = <TData>(
  res: Response,
  message: string,
  data: TData | null = null,
  statusCode = 200
) => {
  const response: ApiResponse<TData, null> = {
    success: true,
    message,
    data,
    error: null,
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = <TError>(
  res: Response,
  message: string,
  error: TError | null = null,
  statusCode = 500
) => {
  const response: ApiResponse<null, TError> = {
    success: false,
    message,
    data: null,
    error,
  };

  return res.status(statusCode).json(response);
};
