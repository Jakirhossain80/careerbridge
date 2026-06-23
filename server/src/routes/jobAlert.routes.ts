import { Router } from "express";

import {
  createAlert,
  getAlerts,
  removeAlert,
  updateAlert,
} from "../controllers/jobAlert.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(verifyFirebaseToken, allowRoles(USER_ROLES.JOB_SEEKER), checkUserStatus);

router.post("/", createAlert);
router.get("/me", getAlerts);
router.patch("/:alertId", updateAlert);
router.delete("/:alertId", removeAlert);

export default router;
