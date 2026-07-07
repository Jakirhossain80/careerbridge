import mongoose, { Schema, model, type Model } from "mongoose";

import {
  AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUS,
  type AuthProvider,
  type UserRole,
  type UserStatus,
} from "../constants/model.constants.js";

export interface IUser {
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  photoURL?: string;
  employerSettings?: {
    notifications?: {
      newApplicant?: boolean;
      interviewReminder?: boolean;
      jobExpiry?: boolean;
      emailNotifications?: boolean;
      dailyDigest?: boolean;
    };
    privacy?: {
      companyProfileVisible?: boolean;
      jobPostingVisible?: boolean;
      contactInfoVisible?: boolean;
      showCompanySize?: boolean;
      showSalaryRange?: boolean;
    };
  };
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  isDeleted: boolean;
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
    phone: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    employerSettings: {
      notifications: {
        newApplicant: { type: Boolean, default: true },
        interviewReminder: { type: Boolean, default: true },
        jobExpiry: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: true },
        dailyDigest: { type: Boolean, default: false },
      },
      privacy: {
        companyProfileVisible: { type: Boolean, default: true },
        jobPostingVisible: { type: Boolean, default: true },
        contactInfoVisible: { type: Boolean, default: true },
        showCompanySize: { type: Boolean, default: true },
        showSalaryRange: { type: Boolean, default: true },
      },
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
    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.PASSWORD,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
userSchema.index({ isDeleted: 1, status: 1 });

export const User =
  (mongoose.models.User as Model<IUser> | undefined) ??
  model<IUser>("User", userSchema);

export default User;
