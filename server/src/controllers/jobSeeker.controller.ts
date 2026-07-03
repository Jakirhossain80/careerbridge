import type { RequestHandler } from "express";

import {
  avatarUploadSchema,
  profileUpdateSchema,
  resumeIdParamsSchema,
  resumeUploadSchema,
} from "../validations/jobSeeker.validation.js";
import {
  createResume,
  deleteResume,
  getAuthenticatedJobSeeker,
  getMyJobSeekerProfile,
  getMyJobSeekerProfileStats,
  getMyJobSeekerSettings,
  getMyResumes,
  setDefaultResume,
  updateMyJobSeekerSettings,
  updateMyJobSeekerProfile,
  uploadMyJobSeekerAvatar,
} from "../services/jobSeeker.service.js";
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
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

export const uploadAvatar: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const file = req.file;

    if (!file) {
      throw new AppError("Avatar image is required", 400);
    }

    avatarUploadSchema.parse({
      mimeType: file.mimetype,
      fileSize: file.size,
    });

    const profile = await uploadMyJobSeekerAvatar(jobSeeker, file);
    successResponse(res, "Profile avatar updated successfully", profile);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getProfileStats: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const stats = await getMyJobSeekerProfileStats(jobSeeker);
    successResponse(res, "Job seeker profile stats fetched successfully", stats);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const getSettings: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const settings = await getMyJobSeekerSettings(jobSeeker);
    successResponse(res, "Job seeker settings fetched successfully", settings);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const updateSettings: RequestHandler = async (req, res, next) => {
  try {
    const jobSeeker = await getAuthenticatedJobSeeker(req.user);
    const payload = profileUpdateSchema.parse(req.body);
    const settings = await updateMyJobSeekerSettings(jobSeeker, payload);
    successResponse(res, "Job seeker settings updated successfully", settings);
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
