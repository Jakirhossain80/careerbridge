import { Router } from "express";

import {
  getPublicJobDetails,
  listFeaturedPublicJobs,
  listPublicJobs,
} from "../controllers/job.controller.js";

const router = Router();

router.get("/", listPublicJobs);
router.get("/featured", listFeaturedPublicJobs);
router.get("/:idOrSlug", getPublicJobDetails);

export default router;
