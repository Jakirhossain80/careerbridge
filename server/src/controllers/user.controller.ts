import type { RequestHandler } from "express";
import {
  AUTH_PROVIDERS,
  USER_ROLES,
  type AuthProvider,
  type UserRole,
} from "../constants/model.constants.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { syncFirebaseUser } from "../services/user.service.js";

const resolveAuthProvider = (firebaseProvider?: string): AuthProvider => {
  if (firebaseProvider === "google.com") {
    return AUTH_PROVIDERS.GOOGLE;
  }

  return AUTH_PROVIDERS.PASSWORD;
};

const resolveRequestedRole = (role: unknown): UserRole | undefined => {
  if (role === USER_ROLES.JOB_SEEKER || role === USER_ROLES.EMPLOYER) {
    return role;
  }

  return undefined;
};

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

    const user = await syncFirebaseUser({
      firebaseUid: firebaseUser.uid,
      name: firebaseUser.name ?? firebaseUser.email,
      email: firebaseUser.email,
      photoURL: firebaseUser.picture,
      authProvider: resolveAuthProvider(firebaseUser.firebase?.sign_in_provider),
      emailVerified: Boolean(firebaseUser.email_verified),
      requestedRole: resolveRequestedRole(req.body?.role),
    });

    successResponse(res, "User synced successfully", user, 200);
  } catch (error) {
    next(error);
  }
};
