import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { successResponse } from "../utils/apiResponse.js";

const router = Router();

router.get("/protected", verifyFirebaseToken, (req, res) => {
  successResponse(res, "Protected route access granted", {
    user: req.user,
  });
});

router.get(
  "/admin",
  verifyFirebaseToken,
  allowRoles("admin"),
  (req, res) => {
    successResponse(res, "Admin route access granted", {
      user: req.user,
    });
  }
);

router.get(
  "/employer",
  verifyFirebaseToken,
  allowRoles("employer"),
  (req, res) => {
    successResponse(res, "Employer route access granted", {
      user: req.user,
    });
  }
);

router.get(
  "/job-seeker",
  verifyFirebaseToken,
  allowRoles("job_seeker"),
  (req, res) => {
    successResponse(res, "Job seeker route access granted", {
      user: req.user,
    });
  }
);

export default router;
