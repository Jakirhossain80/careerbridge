import { Router } from "express";
import env from "../config/env.js";
import { successResponse } from "../utils/apiResponse.js";

const router = Router();

router.get("/", (_req, res) => {
  successResponse(res, "Server is healthy", {
    environment: env.nodeEnv,
  });
});

export default router;
