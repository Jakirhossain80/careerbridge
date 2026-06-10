import { Router } from "express";
import { syncUser } from "../controllers/user.controller.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/sync", verifyFirebaseToken, syncUser);

export default router;
