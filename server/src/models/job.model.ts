import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  JOB_STATUS,
  JOB_TYPE,
  WORK_MODE,
  type JobStatus,
  type JobType,
  type WorkMode,
} from "../constants/model.constants.js";

export interface IJobSalary {
  min?: number;
  max?: number;
  currency?: string;
  negotiable: boolean;
}

export interface IJob {
  employerId: Types.ObjectId;
  companyId: Types.ObjectId;
  title: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  salary?: IJobSalary;
  jobType: JobType;
  workMode: WorkMode;
  location?: string;
  deadline: Date;
  vacancies: number;
  status: JobStatus;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema = new Schema<IJob>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        trim: true,
      },
      negotiable: {
        type: Boolean,
        default: false,
      },
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      required: true,
    },
    workMode: {
      type: String,
      enum: Object.values(WORK_MODE),
      required: true,
    },
    location: {
      type: String,
      index: true,
    },
    deadline: {
      type: Date,
      required: true,
      index: true,
    },
    vacancies: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ jobType: 1, workMode: 1 });
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ employerId: 1, status: 1 });

export const Job =
  (models.Job as Model<IJob> | undefined) ?? model<IJob>("Job", jobSchema);

export default Job;
