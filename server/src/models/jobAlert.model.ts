import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IJobAlert {
  jobSeekerId: Types.ObjectId;
  title: string;
  keyword?: string;
  location?: string;
  category?: string;
  jobType?: string;
  workMode?: string;
  frequency: "daily" | "weekly";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobAlertSchema = new Schema<IJobAlert>(
  {
    jobSeekerId: { type: Schema.Types.ObjectId, ref: "JobSeeker", required: true, index: true },
    title: { type: String, required: true, trim: true },
    keyword: { type: String, trim: true },
    location: { type: String, trim: true },
    category: { type: String, trim: true },
    jobType: { type: String, trim: true },
    workMode: { type: String, trim: true },
    frequency: { type: String, enum: ["daily", "weekly"], required: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

jobAlertSchema.index({ jobSeekerId: 1, isActive: 1 });

export const JobAlert =
  (models.JobAlert as Model<IJobAlert> | undefined) ??
  model<IJobAlert>("JobAlert", jobAlertSchema);

export default JobAlert;
