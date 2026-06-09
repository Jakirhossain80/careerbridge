import type { RequestHandler } from "express";

export type UserRole = "job_seeker" | "employer" | "admin" | "hr_member";

export const allowRoles = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role as UserRole)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
      return;
    }

    next();
  };
};
