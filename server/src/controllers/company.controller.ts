import type { RequestHandler } from "express";
import { ZodError } from "zod";

import { getPublicCompanyProfile } from "../services/company.service.js";
import { companyIdentifierParamsSchema } from "../validations/company.validation.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const getCompanyProfile: RequestHandler = async (req, res, next) => {
  try {
    const { companyId } = companyIdentifierParamsSchema.parse(req.params);
    const company = await getPublicCompanyProfile(companyId);

    if (!company) {
      errorResponse(res, "Company profile not found", null, 404);
      return;
    }

    successResponse(res, "Company profile fetched successfully", company, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponse(res, "Validation failed", error.issues, 400);
      return;
    }

    next(error);
  }
};
