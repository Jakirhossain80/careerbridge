import { Router } from "express";

import {
  createApplication,
  getApplicationDetails,
  getMyAppliedJobs,
  withdrawApplication,
} from "../controllers/application.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(verifyFirebaseToken, allowRoles(USER_ROLES.JOB_SEEKER), checkUserStatus);

router.post("/", createApplication);
router.get("/me", getMyAppliedJobs);
router.get("/:applicationId", getApplicationDetails);
router.patch("/:applicationId/withdraw", withdrawApplication);

export default router;
