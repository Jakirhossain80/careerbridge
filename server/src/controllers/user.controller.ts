import type { RequestHandler } from "express";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { syncFirebaseUser } from "../services/user.service.js";

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
    });

    successResponse(res, "User synced successfully", user, 200);
  } catch (error) {
    next(error);
  }
};
