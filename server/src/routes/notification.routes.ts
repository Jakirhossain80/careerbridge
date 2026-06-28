import { Router } from "express";

import {
  listNotifications,
  readAllNotifications,
  readNotification,
  removeNotification,
  unreadCount,
} from "../controllers/notification.controller.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(verifyFirebaseToken, checkUserStatus);

router.get("/", listNotifications);
router.get("/unread-count", unreadCount);
router.patch("/read-all", readAllNotifications);
router.patch("/:id/read", readNotification);
router.delete("/:id", removeNotification);

export default router;
