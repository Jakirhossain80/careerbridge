import { Router } from "express";

import {
  listNotifications,
  notificationDetails,
  readAllNotifications,
  readNotification,
  removeNotification,
  unreadCount,
  unreadNotification,
} from "../controllers/notification.controller.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";
import { checkUserStatus } from "../middlewares/status.middleware.js";

const router = Router();

router.use(verifyFirebaseToken, checkUserStatus);

router.get("/", listNotifications);
router.get("/unread-count", unreadCount);
router.patch("/read-all", readAllNotifications);
router.get("/:id", notificationDetails);
router.patch("/:id/read", readNotification);
router.patch("/:id/unread", unreadNotification);
router.delete("/:id", removeNotification);

export default router;
