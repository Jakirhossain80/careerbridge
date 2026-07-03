import { Router } from "express";

import { getCompanyProfile } from "../controllers/company.controller.js";

const router = Router();

router.get("/:companyId", getCompanyProfile);

export default router;
