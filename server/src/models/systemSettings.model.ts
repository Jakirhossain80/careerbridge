import { Schema, model, models, type Model, type Types } from "mongoose";

export interface ISystemSettingsAuditLog {
  user?: Types.ObjectId;
  userEmail?: string;
  action: string;
  category: string;
  summary: string;
  createdAt?: Date;
}

export interface ISystemSettings {
  key: string;
  general: Record<string, unknown>;
  platform: Record<string, unknown>;
  authentication: Record<string, unknown>;
  registration: Record<string, unknown>;
  employerApproval: Record<string, unknown>;
  jobApproval: Record<string, unknown>;
  blog: Record<string, unknown>;
  notifications: Record<string, unknown>;
  email: Record<string, unknown>;
  security: Record<string, unknown>;
  seo: Record<string, unknown>;
  analytics: Record<string, unknown>;
  auditLog: ISystemSettingsAuditLog[];
  createdAt?: Date;
  updatedAt?: Date;
}

const auditLogSchema = new Schema<ISystemSettingsAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
      index: true,
    },
    general: { type: Schema.Types.Mixed, default: {} },
    platform: { type: Schema.Types.Mixed, default: {} },
    authentication: { type: Schema.Types.Mixed, default: {} },
    registration: { type: Schema.Types.Mixed, default: {} },
    employerApproval: { type: Schema.Types.Mixed, default: {} },
    jobApproval: { type: Schema.Types.Mixed, default: {} },
    blog: { type: Schema.Types.Mixed, default: {} },
    notifications: { type: Schema.Types.Mixed, default: {} },
    email: { type: Schema.Types.Mixed, default: {} },
    security: { type: Schema.Types.Mixed, default: {} },
    seo: { type: Schema.Types.Mixed, default: {} },
    analytics: { type: Schema.Types.Mixed, default: {} },
    auditLog: {
      type: [auditLogSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const SystemSettings =
  (models.SystemSettings as Model<ISystemSettings> | undefined) ??
  model<ISystemSettings>("SystemSettings", systemSettingsSchema);

export default SystemSettings;
