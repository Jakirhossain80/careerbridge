import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  BLOG_STATUS,
  type BlogStatus,
} from "../constants/model.constants.js";

export interface IBlog {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: Types.ObjectId;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  status: BlogStatus;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  viewCount?: number;
  publishedAt?: Date;
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
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.DRAFT,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ status: 1, category: 1 });
blogSchema.index({ featured: 1, status: 1 });
blogSchema.index({ author: 1, status: 1 });

export const Blog =
  (models.Blog as Model<IBlog> | undefined) ?? model<IBlog>("Blog", blogSchema);

export default Blog;
