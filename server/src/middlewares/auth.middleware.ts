import type { DecodedIdToken } from "firebase-admin/auth";
import type { RequestHandler } from "express";
import { adminAuth } from "../config/firebaseAdmin.js";

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
    res.status(401).json({
      success: false,
      message: "Unauthorized: missing bearer token",
    });
    return;
  }

  try {
    req.user = await adminAuth.verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized: invalid token",
    });
  }
};
