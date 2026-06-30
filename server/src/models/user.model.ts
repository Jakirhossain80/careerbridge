import mongoose, { Schema, model, type Model } from "mongoose";

import {
  USER_ROLES,
  USER_STATUS,
  type UserRole,
  type UserStatus,
} from "../constants/model.constants.js";

export interface IUser {
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  profileCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.JOB_SEEKER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, status: 1 });

export const User =
  (mongoose.models.User as Model<IUser> | undefined) ??
  model<IUser>("User", userSchema);

export default User;
