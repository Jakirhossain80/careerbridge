import mongoose, { Schema, model, type Model, type Types } from "mongoose";

import {
  APPLICATION_STATUS,
  type ApplicationStatus,
} from "../constants/model.constants.js";

export interface IApplicationTimeline {
  status: ApplicationStatus;
  note?: string;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
}

export interface IApplication {
  jobId: Types.ObjectId;
  companyId?: Types.ObjectId;
  applicantId: Types.ObjectId;
  applicantEmail?: string;
  applicantName?: string;
  employerId: Types.ObjectId;
  resume: string;
  resumeUrl?: string;
  coverLetter?: string;
  expectedSalary?: number;
  status: ApplicationStatus;
  timeline: IApplicationTimeline[];
  createdAt?: Date;
  updatedAt?: Date;
}

const applicationTimelineSchema = new Schema<IApplicationTimeline>(
  {
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicantEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    applicantName: {
      type: String,
      trim: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resume: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    expectedSalary: {
      type: Number,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.SUBMITTED,
      index: true,
    },
    timeline: {
      type: [applicationTimelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });
applicationSchema.index({ employerId: 1, status: 1 });
applicationSchema.index({ companyId: 1, status: 1 });

export const Application =
  (mongoose.models.Application as Model<IApplication> | undefined) ??
  model<IApplication>("Application", applicationSchema);

export default Application;
