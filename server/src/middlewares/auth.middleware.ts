import type { DecodedIdToken } from "firebase-admin/auth";
import type { RequestHandler } from "express";
import { getAdminAuth } from "../config/firebaseAdmin.js";
import type { UserRole, UserStatus } from "../constants/model.constants.js";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/apiResponse.js";

export type AuthenticatedFirebaseUser = DecodedIdToken & {
  mongoUserId?: string;
  role?: UserRole;
  status?: UserStatus;
  isDeleted?: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedFirebaseUser;
    }
  }
}

export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    errorResponse(res, "Unauthorized: missing bearer token", null, 401);
    return;
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const user = await User.findOne({
      $or: [
        { firebaseUid: decodedToken.uid },
        ...(decodedToken.email ? [{ email: decodedToken.email.toLowerCase() }] : []),
      ],
    }).select("_id role status isDeleted");

    req.user = {
      ...decodedToken,
      mongoUserId: user?._id.toString(),
      role: user?.role ?? (decodedToken.role as UserRole | undefined),
      status: user?.status ?? (decodedToken.status as UserStatus | undefined),
      isDeleted: user?.isDeleted ?? false,
    };
    next();
  } catch {
    errorResponse(res, "Unauthorized: invalid token", null, 401);
  }
};
