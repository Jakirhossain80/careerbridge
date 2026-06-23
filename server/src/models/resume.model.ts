import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IResume {
  jobSeekerId: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isDefault: boolean;
  uploadedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    jobSeekerId: { type: Schema.Types.ObjectId, ref: "JobSeeker", required: true, index: true },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true, trim: true },
    fileSize: { type: Number, required: true },
    isDefault: { type: Boolean, default: false, index: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resumeSchema.index({ jobSeekerId: 1, isDefault: 1 });

export const Resume =
  (models.Resume as Model<IResume> | undefined) ??
  model<IResume>("Resume", resumeSchema);

export default Resume;
