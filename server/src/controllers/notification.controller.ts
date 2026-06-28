import type { RequestHandler } from "express";

import {
  notificationIdParamsSchema,
  notificationsQuerySchema,
} from "../validations/notification.validation.js";
import type { NotificationType } from "../constants/model.constants.js";
import {
  deleteNotification,
  getAuthenticatedNotificationUser,
  getUnreadNotificationCount,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../services/notification.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { handleControllerError } from "./controllerError.js";

export const listNotifications: RequestHandler = async (req, res, next) => {
  try {
    const recipient = await getAuthenticatedNotificationUser(req.user);
    const query = notificationsQuerySchema.parse(req.query);
    const result = await getUserNotifications(recipient, {
      ...query,
      type: query.type as NotificationType | undefined,
    });

    successResponse(res, "Notifications fetched successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const unreadCount: RequestHandler = async (req, res, next) => {
  try {
    const recipient = await getAuthenticatedNotificationUser(req.user);
    const count = await getUnreadNotificationCount(recipient);

    successResponse(res, "Unread notifications count fetched successfully", {
      count,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const readNotification: RequestHandler = async (req, res, next) => {
  try {
    const recipient = await getAuthenticatedNotificationUser(req.user);
    const params = notificationIdParamsSchema.parse(req.params);
    const notification = await markAsRead(recipient, params.id);

    successResponse(res, "Notification marked as read successfully", notification);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const readAllNotifications: RequestHandler = async (req, res, next) => {
  try {
    const recipient = await getAuthenticatedNotificationUser(req.user);
    const result = await markAllAsRead(recipient);

    successResponse(res, "Notifications marked as read successfully", result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

export const removeNotification: RequestHandler = async (req, res, next) => {
  try {
    const recipient = await getAuthenticatedNotificationUser(req.user);
    const params = notificationIdParamsSchema.parse(req.params);
    const notification = await deleteNotification(recipient, params.id);

    successResponse(res, "Notification deleted successfully", notification);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};
