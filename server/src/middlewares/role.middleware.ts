import type { RequestHandler } from "express";
import type { UserRole } from "../constants/model.constants.js";
import { errorResponse } from "../utils/apiResponse.js";

export const allowRoles = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role as UserRole)) {
      errorResponse(res, "Forbidden: insufficient permissions", null, 403);
      return;
    }

    next();
  };
};
