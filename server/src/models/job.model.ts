import mongoose, { Schema, model, type Model, type Types } from "mongoose";

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
  employerEmail?: string;
  companyId: Types.ObjectId;
  companyName?: string;
  title: string;
  slug?: string;
  description: string;
  responsibilities: string[];
  requirements?: string[];
  skills: string[];
  category?: string;
  industry?: string;
  salary?: IJobSalary;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  jobType: JobType;
  workMode: WorkMode;
  workplaceType?: WorkMode;
  location?: string;
  deadline: Date;
  experienceLevel?: string;
  vacancies: number;
  status: JobStatus;
  featured: boolean;
  applicationsCount: number;
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
    employerEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    industry: {
      type: String,
      trim: true,
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
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    currency: {
      type: String,
      trim: true,
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
    workplaceType: {
      type: String,
      enum: Object.values(WORK_MODE),
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
    experienceLevel: {
      type: String,
      trim: true,
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
    applicationsCount: {
      type: Number,
      default: 0,
      min: 0,
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
jobSchema.index({ slug: 1 }, { unique: true, sparse: true });

export const Job =
  (mongoose.models.Job as Model<IJob> | undefined) ??
  model<IJob>("Job", jobSchema);

export default Job;
