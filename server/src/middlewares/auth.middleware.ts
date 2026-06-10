import type { DecodedIdToken } from "firebase-admin/auth";
import type { RequestHandler } from "express";
import { adminAuth } from "../config/firebaseAdmin.js";
import { errorResponse } from "../utils/apiResponse.js";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
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
    req.user = await adminAuth.verifyIdToken(token);
    next();
  } catch {
    errorResponse(res, "Unauthorized: invalid token", null, 401);
  }
};
