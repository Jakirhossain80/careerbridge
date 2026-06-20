import { Router } from "express";

import {
  archiveJob,
  createCompany,
  createJob,
  getApplicants,
  getJobs,
  getMyCompany,
  updateJob,
  updateMyCompany,
  updateStatus,
} from "../controllers/employer.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(
  verifyFirebaseToken,
  allowRoles(USER_ROLES.EMPLOYER, USER_ROLES.HR_MEMBER),
  checkUserStatus
);

router.post("/company", createCompany);
router.get("/company", getMyCompany);
router.patch("/company", updateMyCompany);

router.post("/jobs", createJob);
router.get("/jobs", getJobs);
router.patch("/jobs/:jobId", updateJob);
router.patch("/jobs/:jobId/archive", archiveJob);
router.delete("/jobs/:jobId", archiveJob);
router.get("/jobs/:jobId/applicants", getApplicants);

router.patch("/applications/:applicationId/status", updateStatus);

export default router;
