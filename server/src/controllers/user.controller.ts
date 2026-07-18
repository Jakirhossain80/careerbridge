import type { RequestHandler } from "express";
import {
  AUTH_PROVIDERS,
  USER_ROLES,
  type AuthProvider,
  type UserRole,
} from "../constants/model.constants.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { syncFirebaseUser } from "../services/user.service.js";
import { z } from "zod";

const resolveAuthProvider = (firebaseProvider?: string): AuthProvider => {
  if (firebaseProvider === "google.com") {
    return AUTH_PROVIDERS.GOOGLE;
  }

  return AUTH_PROVIDERS.PASSWORD;
};

export const syncUserSchema = z.object({
  role: z.enum([USER_ROLES.JOB_SEEKER, USER_ROLES.EMPLOYER]).optional(),
}).strict();

export const syncUser: RequestHandler = async (req, res, next) => {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser) {
      errorResponse(res, "Unauthorized: missing Firebase user", null, 401);
      return;
    }

    if (!firebaseUser.email) {
      errorResponse(res, "Firebase user email is required", null, 400);
      return;
    }

    const payload = syncUserSchema.parse(req.body ?? {});
    const user = await syncFirebaseUser({
      firebaseUid: firebaseUser.uid,
      name: firebaseUser.name ?? firebaseUser.email,
      email: firebaseUser.email,
      photoURL: firebaseUser.picture,
      authProvider: resolveAuthProvider(firebaseUser.firebase?.sign_in_provider),
      emailVerified: Boolean(firebaseUser.email_verified),
      requestedRole: payload.role as UserRole | undefined,
    });

    successResponse(res, "User synced successfully", user, 200);
  } catch (error) {
    next(error);
  }
};
