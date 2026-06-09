import { Schema, model, models, type Model } from "mongoose";

import {
  CATEGORY_STATUS,
  type CategoryStatus,
} from "../constants/model.constants.js";

export interface ICategory {
  name: string;
  slug: string;
  icon?: string;
  status: CategoryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(CATEGORY_STATUS),
      default: CATEGORY_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ status: 1, name: 1 });

export const Category =
  (models.Category as Model<ICategory> | undefined) ??
  model<ICategory>("Category", categorySchema);

export default Category;
