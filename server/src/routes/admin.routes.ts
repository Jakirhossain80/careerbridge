import { Router } from "express";

import {
  applicationDetails,
  applications,
  approveEmployer,
  approveJob,
  blockUser,
  blogDetails,
  blogs,
  categories,
  changeRole,
  createBlog,
  createCategory,
  employerDetails,
  employers,
  jobDetails,
  jobSeekerDetails,
  jobSeekerStats,
  jobSeekers,
  jobs,
  publishBlog,
  rejectEmployer,
  rejectJob,
  removeBlog,
  removeCategory,
  removeJob,
  removeUser,
  reportDetails,
  reports,
  stats,
  unblockUser,
  unpublishBlog,
  updateApplication,
  updateBlog,
  updateCategory,
  updateEmployer,
  updateJob,
  updateJobSeeker,
  updateJobSeekerStatus,
  updateReportStatus,
  updateUser,
  userDetails,
  users,
} from "../controllers/admin.controller.js";
import { USER_ROLES } from "../constants/model.constants.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(
  verifyFirebaseToken,
  allowRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  checkUserStatus
);

router.get("/stats", stats);

router.get("/users", users);
router.get("/users/:userId", userDetails);
router.patch("/users/:userId", updateUser);
router.delete("/users/:userId", removeUser);
router.patch("/users/:userId/role", changeRole);
router.patch("/users/:userId/block", blockUser);
router.patch("/users/:userId/unblock", unblockUser);

router.get("/job-seekers", jobSeekers);
router.get("/job-seekers/stats", jobSeekerStats);
router.get("/job-seekers/:jobSeekerId", jobSeekerDetails);
router.patch("/job-seekers/:jobSeekerId", updateJobSeeker);
router.patch("/job-seekers/:jobSeekerId/status", updateJobSeekerStatus);

router.get("/employers", employers);
router.get("/employers/:employerId", employerDetails);
router.patch("/employers/:employerId", updateEmployer);
router.patch("/employers/:employerId/approve", approveEmployer);
router.patch("/employers/:employerId/reject", rejectEmployer);

router.get("/jobs", jobs);
router.get("/jobs/:jobId", jobDetails);
router.patch("/jobs/:jobId", updateJob);
router.delete("/jobs/:jobId", removeJob);
router.patch("/jobs/:jobId/approve", approveJob);
router.patch("/jobs/:jobId/reject", rejectJob);

router.get("/applications", applications);
router.get("/applications/:applicationId", applicationDetails);
router.patch("/applications/:applicationId", updateApplication);

router.get("/categories", categories);
router.post("/categories", createCategory);
router.patch("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", removeCategory);

router.get("/blogs", blogs);
router.post("/blogs", createBlog);
router.get("/blogs/:blogId", blogDetails);
router.patch("/blogs/:blogId", updateBlog);
router.delete("/blogs/:blogId", removeBlog);
router.patch("/blogs/:blogId/publish", publishBlog);
router.patch("/blogs/:blogId/unpublish", unpublishBlog);

router.get("/reports", reports);
router.get("/reports/:reportId", reportDetails);
router.patch("/reports/:reportId/status", updateReportStatus);

export default router;
