import { Router } from "express";
import authTestRoutes from "./authTest.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use("/auth-test", authTestRoutes);
router.use("/health", healthRoutes);

export default router;
