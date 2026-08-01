import { Router } from "express";

import { USER_ROLES } from "../constants/model.constants.js";
import { dashboardSearch } from "../controllers/dashboardSearch.controller.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(
  verifyFirebaseToken,
  allowRoles(
    USER_ROLES.JOB_SEEKER,
    USER_ROLES.EMPLOYER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
  ),
  checkUserStatus,
);

router.get("/search", dashboardSearch);

export default router;
