import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  REPORT_STATUS,
  type ReportStatus,
} from "../constants/model.constants.js";

export interface IReport {
  reporterId?: Types.ObjectId;
  reporterName?: string;
  reporterEmail?: string;
  reporterAvatar?: string;
  targetType: "user" | "employer" | "company" | "job" | "application" | "blog" | "other";
  targetId?: Types.ObjectId;
  targetLabel?: string;
  reason: string;
  severity?: "critical" | "high" | "medium" | "low";
  description?: string;
  evidence?: string[];
  status: ReportStatus;
  reviewedBy?: Types.ObjectId;
  moderatorNote?: string;
  resolutionNote?: string;
  assignedModeratorId?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    reporterEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    reporterName: {
      type: String,
      trim: true,
    },
    reporterAvatar: {
      type: String,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ["user", "employer", "company", "job", "application", "blog", "other"],
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    targetLabel: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "low",
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    evidence: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    moderatorNote: {
      type: String,
      trim: true,
    },
    resolutionNote: {
      type: String,
      trim: true,
    },
    assignedModeratorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ severity: 1, status: 1 });
reportSchema.index({ targetType: 1, targetId: 1 });

export const Report =
  (models.Report as Model<IReport> | undefined) ??
  model<IReport>("Report", reportSchema);

export default Report;
