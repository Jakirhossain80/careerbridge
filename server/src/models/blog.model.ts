import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  BLOG_STATUS,
  type BlogStatus,
} from "../constants/model.constants.js";

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  category?: string;
  status: BlogStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.DRAFT,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ status: 1, category: 1 });
blogSchema.index({ author: 1, status: 1 });

export const Blog =
  (models.Blog as Model<IBlog> | undefined) ?? model<IBlog>("Blog", blogSchema);

export default Blog;
