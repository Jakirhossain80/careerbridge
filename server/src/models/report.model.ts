import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  REPORT_STATUS,
  type ReportStatus,
} from "../constants/model.constants.js";

export interface IReport {
  reporterId?: Types.ObjectId;
  reporterEmail?: string;
  targetType: "user" | "employer" | "job" | "application" | "blog" | "other";
  targetId?: Types.ObjectId;
  reason: string;
  description?: string;
  status: ReportStatus;
  reviewedBy?: Types.ObjectId;
  resolutionNote?: string;
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
    targetType: {
      type: String,
      enum: ["user", "employer", "job", "application", "blog", "other"],
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
    resolutionNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1 });

export const Report =
  (models.Report as Model<IReport> | undefined) ??
  model<IReport>("Report", reportSchema);

export default Report;
