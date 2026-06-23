import type { RequestHandler } from "express";

import {
  profileUpdateSchema,
  resumeIdParamsSchema,
  resumeUploadSchema,
} from "../validations/jobSeeker.validation.js";
import {
  createResume,
  deleteResume,
  getAuthenticatedJobSeeker,
  getMyJobSeekerProfile,
  getMyResumes,
  setDefaultResume,
  updateMyJobSeekerProfile,
} from "../services/jobSeeker.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { handleControllerError } from "./controllerError.js";

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const profile = await getMyJobSeekerProfile(jobSeeker);
    successResponse(res, "Job seeker profile fetched successfully", profile);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateMe: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const payload = profileUpdateSchema.parse(req.body);
    const profile = await updateMyJobSeekerProfile(jobSeeker, payload);
    successResponse(res, "Job seeker profile updated successfully", profile);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const uploadResume: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const file = req.file;

    const payload = resumeUploadSchema.parse({
      fileName: req.body.fileName ?? file?.originalname,
      // TODO: Replace this placeholder with the selected storage provider URL.
      fileUrl:
        req.body.fileUrl ??
        (file ? `/uploads/resumes/${Date.now()}-${file.originalname}` : undefined),
      fileType: req.body.fileType ?? file?.mimetype,
      fileSize: req.body.fileSize ?? file?.size,
      isDefault: req.body.isDefault,
    });

    const resume = await createResume(jobSeeker, payload);
    successResponse(res, "Resume uploaded successfully", resume, 201);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getResumes: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const resumes = await getMyResumes(jobSeeker);
    successResponse(res, "Resumes fetched successfully", resumes);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const makeDefaultResume: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = resumeIdParamsSchema.parse(req.params);
    const resume = await setDefaultResume(jobSeeker, params.resumeId);
    successResponse(res, "Default resume updated successfully", resume);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeResume: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const params = resumeIdParamsSchema.parse(req.params);
    const resume = await deleteResume(jobSeeker, params.resumeId);
    successResponse(res, "Resume deleted successfully", resume);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
