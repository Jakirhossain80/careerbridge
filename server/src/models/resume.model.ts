import mongoose, { Schema, model, type Model, type Types } from "mongoose";

export interface IResume {
  jobSeekerId: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  storageProvider: "cloudinary";
  providerAssetId: string;
  providerPublicId: string;
  providerResourceType: "raw";
  providerDeliveryType: "private";
  providerFormat: string;
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
    storageProvider: { type: String, enum: ["cloudinary"], required: true },
    providerAssetId: { type: String, required: true },
    providerPublicId: { type: String, required: true },
    providerResourceType: { type: String, enum: ["raw"], required: true },
    providerDeliveryType: { type: String, enum: ["private"], required: true },
    providerFormat: { type: String, required: true },
    isDefault: { type: Boolean, default: false, index: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resumeSchema.index(
  { jobSeekerId: 1 },
  {
    name: "unique_default_resume_per_job_seeker",
    unique: true,
    partialFilterExpression: { isDefault: true },
  }
);

export const Resume =
  (mongoose.models.Resume as Model<IResume> | undefined) ??
  model<IResume>("Resume", resumeSchema);

export default Resume;
