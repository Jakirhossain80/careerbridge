import type { RequestHandler } from "express";
import { USER_STATUS, type UserStatus } from "../constants/model.constants.js";
import { errorResponse } from "../utils/apiResponse.js";

export const checkUserStatus: RequestHandler = (req, res, next) => {
  const status = req.user?.status as UserStatus | undefined;

  if (status === USER_STATUS.ACTIVE) {
    next();
    return;
  }

  if (status === USER_STATUS.BLOCKED) {
    errorResponse(res, "Forbidden: account is blocked", null, 403);
    return;
  }

  if (status === USER_STATUS.PENDING) {
    errorResponse(res, "Forbidden: account approval is pending", null, 403);
    return;
  }

  errorResponse(res, "Forbidden: invalid account status", null, 403);
};
