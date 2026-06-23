import type { RequestHandler } from "express";

import {
  alertIdParamsSchema,
  jobAlertCreateSchema,
  jobAlertsQuerySchema,
  jobAlertUpdateSchema,
} from "../validations/jobAlert.validation.js";
import {
  createJobAlert,
  deleteJobAlert,
  getMyJobAlerts,
  updateJobAlert,
} from "../services/jobAlert.service.js";
import { getAuthenticatedJobSeeker } from "../services/jobSeeker.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { handleControllerError } from "./controllerError.js";

export const createAlert: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const payload = jobAlertCreateSchema.parse(req.body);
    const alert = await createJobAlert(jobSeeker, payload);
    successResponse(res, "Job alert created successfully", alert, 201);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getAlerts: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const query = jobAlertsQuerySchema.parse(req.query);
    const result = await getMyJobAlerts(jobSeeker, query);
    successResponse(res, "Job alerts fetched successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateAlert: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = alertIdParamsSchema.parse(req.params);
    const payload = jobAlertUpdateSchema.parse(req.body);
    const alert = await updateJobAlert(jobSeeker, params.alertId, payload);
    successResponse(res, "Job alert updated successfully", alert);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeAlert: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = alertIdParamsSchema.parse(req.params);
    const alert = await deleteJobAlert(jobSeeker, params.alertId);
    successResponse(res, "Job alert deleted successfully", alert);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
