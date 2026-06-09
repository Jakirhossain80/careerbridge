import { Schema, model, models, type Model, type Types } from "mongoose";

export interface ISavedJob {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const SavedJob =
  (models.SavedJob as Model<ISavedJob> | undefined) ??
  model<ISavedJob>("SavedJob", savedJobSchema);

export default SavedJob;
