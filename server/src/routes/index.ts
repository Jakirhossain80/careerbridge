import { Router } from "express";
import authTestRoutes from "./authTest.routes.js";
import employerRoutes from "./employer.routes.js";
import healthRoutes from "./health.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth-test", authTestRoutes);
router.use("/employer", employerRoutes);
router.use("/health", healthRoutes);
router.use("/users", userRoutes);

export default router;
