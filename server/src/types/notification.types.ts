import type { Types } from "mongoose";

import type {
  NotificationEntityType,
  NotificationType,
  UserRole,
} from "../constants/model.constants.js";

export type NotificationRecipient = {
  id: string;
  role: UserRole;
};

export type CreateNotificationInput = {
  recipientId: string | Types.ObjectId;
  recipientRole: UserRole;
  actorId?: string | Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  entityType: NotificationEntityType;
  entityId: string | Types.ObjectId;
  link?: string;
  metadata?: Record<string, unknown>;
};

export type NotificationsQuery = {
  page: number;
  limit: number;
  read?: boolean;
  type?: NotificationType;
};
