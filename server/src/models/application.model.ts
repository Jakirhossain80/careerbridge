import { Schema, model, models, type Model, type Types } from "mongoose";

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
  applicantId: Types.ObjectId;
  employerId: Types.ObjectId;
  resume: string;
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
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

export const Application =
  (models.Application as Model<IApplication> | undefined) ??
  model<IApplication>("Application", applicationSchema);

export default Application;
