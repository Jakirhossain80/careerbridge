import { Router } from "express";

import {
  archiveJob,
  createCompany,
  createJob,
  getApplicationDetails,
  getApplications,
  getApplicants,
  getJobs,
  getMyCompany,
  getSettings,
  updateJob,
  updateMyCompany,
  updateSettings,
  updateStatus,
  uploadCompanyBanner,
  uploadCompanyLogo,
} from "../controllers/employer.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";
import {
  uploadCompanyBannerFile,
  uploadCompanyLogoFile,
} from "../middlewares/upload.middleware.js";

const router = Router();

router.use(
  verifyFirebaseToken,
  allowRoles(USER_ROLES.EMPLOYER, USER_ROLES.HR_MEMBER)
);

router.post("/company", createCompany);
router.post("/company/logo", uploadCompanyLogoFile, uploadCompanyLogo);
router.use(checkUserStatus);
router.get("/company", getMyCompany);
router.patch("/company", updateMyCompany);
router.get("/settings", getSettings);
router.patch("/settings", updateSettings);
router.post("/company/banner", uploadCompanyBannerFile, uploadCompanyBanner);

router.post("/jobs", createJob);
router.get("/jobs", getJobs);
router.patch("/jobs/:jobId", updateJob);
router.patch("/jobs/:jobId/archive", archiveJob);
router.delete("/jobs/:jobId", archiveJob);
router.get("/jobs/:jobId/applicants", getApplicants);

router.get("/applications", getApplications);
router.get("/applications/:applicationId", getApplicationDetails);
router.patch("/applications/:applicationId/status", updateStatus);

export default router;
