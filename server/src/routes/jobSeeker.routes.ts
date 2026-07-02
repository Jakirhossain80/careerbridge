import { Router } from "express";
import multer from "multer";

import {
  getMe,
  getProfileStats,
  getResumes,
  getSettings,
  makeDefaultResume,
  removeResume,
  updateSettings,
  updateMe,
  uploadResume,
} from "../controllers/jobSeeker.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyFirebaseToken, allowRoles(USER_ROLES.JOB_SEEKER), checkUserStatus);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.get("/me/stats", getProfileStats);
router.get("/me/settings", getSettings);
router.patch("/me/settings", updateSettings);
router.post("/resumes", upload.single("resume"), uploadResume);
router.get("/resumes", getResumes);
router.patch("/resumes/:resumeId/default", makeDefaultResume);
router.delete("/resumes/:resumeId", removeResume);

export default router;
