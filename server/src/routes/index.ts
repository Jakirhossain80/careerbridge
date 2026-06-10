import { Router } from "express";
import authTestRoutes from "./authTest.routes.js";
import healthRoutes from "./health.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth-test", authTestRoutes);
router.use("/health", healthRoutes);
router.use("/users", userRoutes);

export default router;
