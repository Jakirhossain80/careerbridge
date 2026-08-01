import { Router } from "express";
import env from "../config/env.js";
import authTestRoutes from "./authTest.routes.js";
import adminRoutes from "./admin.routes.js";
import applicationRoutes from "./application.routes.js";
import companyRoutes from "./company.routes.js";
import dashboardSearchRoutes from "./dashboardSearch.routes.js";
import employerRoutes from "./employer.routes.js";
import healthRoutes from "./health.routes.js";
import jobRoutes from "./job.routes.js";
import jobAlertRoutes from "./jobAlert.routes.js";
import jobSeekerRoutes from "./jobSeeker.routes.js";
import notificationRoutes from "./notification.routes.js";
import savedJobRoutes from "./savedJob.routes.js";
import userRoutes from "./user.routes.js";

export const createApiRouter = (nodeEnv = env.nodeEnv) => {
  const router = Router();

  if (nodeEnv !== "production") {
    router.use("/auth-test", authTestRoutes);
  }
  router.use("/admin", adminRoutes);
  router.use("/applications", applicationRoutes);
  router.use("/companies", companyRoutes);
  router.use("/dashboard", dashboardSearchRoutes);
  router.use("/employer", employerRoutes);
  router.use("/health", healthRoutes);
  router.use("/jobs", jobRoutes);
  router.use("/job-alerts", jobAlertRoutes);
  router.use("/job-seekers", jobSeekerRoutes);
  router.use("/notifications", notificationRoutes);
  router.use("/saved-jobs", savedJobRoutes);
  router.use("/users", userRoutes);

  return router;
};

export default createApiRouter();
