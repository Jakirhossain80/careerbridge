import { Router } from "express";

import {
  createSavedJob,
  deleteSavedJob,
  getSavedJobs,
} from "../controllers/savedJob.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(verifyFirebaseToken, allowRoles(USER_ROLES.JOB_SEEKER), checkUserStatus);

router.post("/", createSavedJob);
router.get("/me", getSavedJobs);
router.delete("/:jobId", deleteSavedJob);

export default router;
