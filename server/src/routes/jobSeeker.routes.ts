import { Router } from "express";

import {
  getMe,
  getProfileStats,
  getResumes,
  getSettings,
  downloadResume,
  makeDefaultResume,
  removeResume,
  replaceResume,
  updateSettings,
  updateMe,
  uploadAvatar,
  uploadResume,
} from "../controllers/jobSeeker.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";
import {
  uploadAvatarFile,
  uploadResumeFile,
  validateResumeFileContents,
} from "../middlewares/upload.middleware.js";

const router = Router();

router.use(verifyFirebaseToken, allowRoles(USER_ROLES.JOB_SEEKER), checkUserStatus);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.post("/me/avatar", uploadAvatarFile, uploadAvatar);
router.get("/me/stats", getProfileStats);
router.get("/me/settings", getSettings);
router.patch("/me/settings", updateSettings);
router.post("/resumes", uploadResumeFile, validateResumeFileContents, uploadResume);
router.get("/resumes", getResumes);
router.get("/resumes/:resumeId/download", downloadResume);
router.patch(
  "/resumes/:resumeId",
  uploadResumeFile,
  validateResumeFileContents,
  replaceResume
);
router.patch("/resumes/:resumeId/default", makeDefaultResume);
router.delete("/resumes/:resumeId", removeResume);

export default router;
