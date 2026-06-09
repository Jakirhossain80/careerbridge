import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  INTERVIEW_STATUS,
  type InterviewStatus,
} from "../constants/model.constants.js";

export interface IInterview {
  applicationId: Types.ObjectId;
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  employerId: Types.ObjectId;
  dateTime: Date;
  meetingLink?: string;
  status: InterviewStatus;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
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
    dateTime: {
      type: Date,
      required: true,
      index: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(INTERVIEW_STATUS),
      default: INTERVIEW_STATUS.SCHEDULED,
      index: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ employerId: 1, dateTime: 1 });
interviewSchema.index({ applicantId: 1, dateTime: 1 });

export const Interview =
  (models.Interview as Model<IInterview> | undefined) ??
  model<IInterview>("Interview", interviewSchema);

export default Interview;
