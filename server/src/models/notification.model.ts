import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  NOTIFICATION_ENTITY_TYPE,
  NOTIFICATION_TYPE,
  USER_ROLES,
  type NotificationEntityType,
  type NotificationType,
  type UserRole,
} from "../constants/model.constants.js";

export interface INotification {
  recipientId: Types.ObjectId;
  recipientRole: UserRole;
  actorId?: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  entityType: NotificationEntityType;
  entityId: Types.ObjectId;
  link?: string;
  read: boolean;
  metadata?: Record<string, unknown>;
  userId?: Types.ObjectId;
  isRead?: boolean;
  relatedId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: Object.values(NOTIFICATION_ENTITY_TYPE),
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    link: {
      type: String,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ entityType: 1, entityId: 1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export const Notification =
  (models.Notification as Model<INotification> | undefined) ??
  model<INotification>("Notification", notificationSchema);

export default Notification;
