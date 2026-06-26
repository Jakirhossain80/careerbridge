import type { RequestHandler } from "express";

import {
  applicationUpdateSchema,
  adminJobSeekerQuerySchema,
  blogCreateSchema,
  blogUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  employerUpdateSchema,
  idParamSchema,
  jobUpdateSchema,
  jobSeekerStatusUpdateSchema,
  jobSeekerUpdateSchema,
  moderationReasonSchema,
  paginationQuerySchema,
  reportStatusUpdateSchema,
  roleChangeSchema,
  userUpdateSchema,
} from "../validations/admin.validation.js";
import { handleControllerError } from "./controllerError.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  approveAdminEmployer,
  approveAdminJob,
  blockAdminUser,
  changeAdminUserRole,
  createAdminBlog,
  createAdminCategory,
  deleteAdminBlog,
  deleteAdminCategory,
  deleteAdminJob,
  deleteAdminUser,
  getAdminApplication,
  getAdminBlog,
  getAdminEmployer,
  getAdminJob,
  getAdminJobSeeker,
  getAdminJobSeekerStats,
  getAdminReport,
  getAdminStats,
  getAdminUser,
  getAuthenticatedAdmin,
  listAdminApplications,
  listAdminBlogs,
  listAdminCategories,
  listAdminEmployers,
  listAdminJobs,
  listAdminJobSeekers,
  listAdminReports,
  listAdminUsers,
  publishAdminBlog,
  rejectAdminEmployer,
  rejectAdminJob,
  unblockAdminUser,
  unpublishAdminBlog,
  updateAdminApplication,
  updateAdminBlog,
  updateAdminCategory,
  updateAdminEmployer,
  updateAdminJob,
  updateAdminJobSeeker,
  updateAdminJobSeekerStatus,
  updateAdminReportStatus,
  updateAdminUser,
} from "../services/admin.service.js";
import type {
  BlogStatus,
  CategoryStatus,
  CompanyVerificationStatus,
  JobStatus,
  UserRole,
  UserStatus,
} from "../constants/model.constants.js";
import AppError from "../utils/AppError.js";

const getRequiredParam = (params: ReturnType<typeof idParamSchema.parse>) => {
  const value = Object.values(params).find((param): param is string =>
    Boolean(param)
  );

  if (!value) {
    throw new AppError("Missing required route parameter", 400);
  }

  return value;
};

export const stats: RequestHandler = async (_req, res, next) => {
  try {
    successResponse(res, "Admin stats fetched successfully", await getAdminStats());
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const users: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(res, "Users fetched successfully", await listAdminUsers(query));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const jobSeekers: RequestHandler = async (req, res, next) => {
  try {
    const query = adminJobSeekerQuerySchema.parse(req.query);
    successResponse(
      res,
      "Job seekers fetched successfully",
      await listAdminJobSeekers(query)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const jobSeekerStats: RequestHandler = async (_req, res, next) => {
  try {
    successResponse(
      res,
      "Job seeker stats fetched successfully",
      await getAdminJobSeekerStats()
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const jobSeekerDetails: RequestHandler = async (req, res, next) => {
  try {
    const jobSeekerId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(
      res,
      "Job seeker fetched successfully",
      await getAdminJobSeeker(jobSeekerId)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateJobSeeker: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const jobSeekerId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = jobSeekerUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Job seeker updated successfully",
      await updateAdminJobSeeker(actor, jobSeekerId, {
        ...payload,
        status: payload.status as UserStatus | undefined,
      })
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateJobSeekerStatus: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const jobSeekerId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = jobSeekerStatusUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Job seeker status updated successfully",
      await updateAdminJobSeekerStatus(actor, jobSeekerId, payload.status as UserStatus)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const userDetails: RequestHandler = async (req, res, next) => {
  try {
    const userId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "User fetched successfully", await getAdminUser(userId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const userId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = userUpdateSchema.parse(req.body);
    successResponse(
      res,
      "User updated successfully",
      await updateAdminUser(actor, userId, {
        ...payload,
        status: payload.status as UserStatus | undefined,
      })
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeUser: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const userId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "User deleted successfully", await deleteAdminUser(actor, userId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const changeRole: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const userId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = roleChangeSchema.parse(req.body);
    successResponse(
      res,
      "User role updated successfully",
      await changeAdminUserRole(actor, userId, payload.role as UserRole)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const blockUser: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const userId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "User blocked successfully", await blockAdminUser(actor, userId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const unblockUser: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const userId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "User unblocked successfully", await unblockAdminUser(actor, userId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const employers: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(res, "Employers fetched successfully", await listAdminEmployers(query));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const employerDetails: RequestHandler = async (req, res, next) => {
  try {
    const employerId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Employer fetched successfully", await getAdminEmployer(employerId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateEmployer: RequestHandler = async (req, res, next) => {
  try {
    const employerId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = employerUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Employer updated successfully",
      await updateAdminEmployer(employerId, {
        ...payload,
        verificationStatus:
          payload.verificationStatus as CompanyVerificationStatus | undefined,
      })
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const approveEmployer: RequestHandler = async (req, res, next) => {
  try {
    moderationReasonSchema.parse(req.body);
    const employerId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Employer approved successfully", await approveAdminEmployer(employerId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const rejectEmployer: RequestHandler = async (req, res, next) => {
  try {
    moderationReasonSchema.parse(req.body);
    const employerId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Employer rejected successfully", await rejectAdminEmployer(employerId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const jobs: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(res, "Jobs fetched successfully", await listAdminJobs(query));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const jobDetails: RequestHandler = async (req, res, next) => {
  try {
    const jobId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Job fetched successfully", await getAdminJob(jobId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateJob: RequestHandler = async (req, res, next) => {
  try {
    const jobId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = jobUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Job updated successfully",
      await updateAdminJob(jobId, {
        ...payload,
        status: payload.status as JobStatus | undefined,
      })
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeJob: RequestHandler = async (req, res, next) => {
  try {
    const jobId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Job archived successfully", await deleteAdminJob(jobId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const approveJob: RequestHandler = async (req, res, next) => {
  try {
    moderationReasonSchema.parse(req.body);
    const jobId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Job approved successfully", await approveAdminJob(jobId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const rejectJob: RequestHandler = async (req, res, next) => {
  try {
    moderationReasonSchema.parse(req.body);
    const jobId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Job rejected successfully", await rejectAdminJob(jobId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const applications: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(
      res,
      "Applications fetched successfully",
      await listAdminApplications(query)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const applicationDetails: RequestHandler = async (req, res, next) => {
  try {
    const applicationId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(
      res,
      "Application fetched successfully",
      await getAdminApplication(applicationId)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateApplication: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const applicationId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = applicationUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Application updated successfully",
      await updateAdminApplication(actor, applicationId, payload)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const categories: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(res, "Categories fetched successfully", await listAdminCategories(query));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const payload = categoryCreateSchema.parse(req.body);
    successResponse(
      res,
      "Category created successfully",
      await createAdminCategory({
        ...payload,
        status: payload.status as CategoryStatus,
      }),
      201
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = categoryUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Category updated successfully",
      await updateAdminCategory(categoryId, {
        ...payload,
        status: payload.status as CategoryStatus | undefined,
      })
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(
      res,
      "Category deactivated successfully",
      await deleteAdminCategory(categoryId)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const blogs: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(res, "Blogs fetched successfully", await listAdminBlogs(query));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const blogDetails: RequestHandler = async (req, res, next) => {
  try {
    const blogId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Blog fetched successfully", await getAdminBlog(blogId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const createBlog: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const payload = blogCreateSchema.parse(req.body);
    successResponse(
      res,
      "Blog created successfully",
      await createAdminBlog(actor, {
        ...payload,
        status: payload.status as BlogStatus,
      }),
      201
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateBlog: RequestHandler = async (req, res, next) => {
  try {
    const blogId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = blogUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Blog updated successfully",
      await updateAdminBlog(blogId, {
        ...payload,
        status: payload.status as BlogStatus | undefined,
      })
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeBlog: RequestHandler = async (req, res, next) => {
  try {
    const blogId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Blog archived successfully", await deleteAdminBlog(blogId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const publishBlog: RequestHandler = async (req, res, next) => {
  try {
    const blogId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Blog published successfully", await publishAdminBlog(blogId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const unpublishBlog: RequestHandler = async (req, res, next) => {
  try {
    const blogId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Blog unpublished successfully", await unpublishAdminBlog(blogId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const reports: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationQuerySchema.parse(req.query);
    successResponse(res, "Reports fetched successfully", await listAdminReports(query));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const reportDetails: RequestHandler = async (req, res, next) => {
  try {
    const reportId = getRequiredParam(idParamSchema.parse(req.params));
    successResponse(res, "Report fetched successfully", await getAdminReport(reportId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateReportStatus: RequestHandler = async (req, res, next) => {
  try {
    const actor = await getAuthenticatedAdmin(req.user);
    const reportId = getRequiredParam(idParamSchema.parse(req.params));
    const payload = reportStatusUpdateSchema.parse(req.body);
    successResponse(
      res,
      "Report status updated successfully",
      await updateAdminReportStatus(actor, reportId, payload)
    );
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
