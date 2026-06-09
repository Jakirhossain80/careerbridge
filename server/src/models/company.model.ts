import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  COMPANY_VERIFICATION_STATUS,
  type CompanyVerificationStatus,
} from "../constants/model.constants.js";

export interface ICompany {
  ownerId: Types.ObjectId;
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  verificationStatus: CompanyVerificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const companySchema = new Schema<ICompany>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    industry: {
      type: String,
      index: true,
    },
    size: {
      type: String,
    },
    location: {
      type: String,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(COMPANY_VERIFICATION_STATUS),
      default: COMPANY_VERIFICATION_STATUS.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ ownerId: 1, verificationStatus: 1 });
companySchema.index({ industry: 1, location: 1 });

export const Company =
  (models.Company as Model<ICompany> | undefined) ??
  model<ICompany>("Company", companySchema);

export default Company;
