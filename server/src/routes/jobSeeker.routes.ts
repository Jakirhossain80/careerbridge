import { Router } from "express";
import multer from "multer";

import {
  getMe,
  getResumes,
  makeDefaultResume,
  removeResume,
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
router.post("/resumes", upload.single("resume"), uploadResume);
router.get("/resumes", getResumes);
router.patch("/resumes/:resumeId/default", makeDefaultResume);
router.delete("/resumes/:resumeId", removeResume);

export default router;
