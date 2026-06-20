import { Schema, model, models, type Model, type Types } from "mongoose";

import {
  COMPANY_VERIFICATION_STATUS,
  type CompanyVerificationStatus,
} from "../constants/model.constants.js";

export interface ICompany {
  ownerId: Types.ObjectId;
  ownerEmail?: string;
  name: string;
  companyName?: string;
  slug?: string;
  logo?: string;
  logoUrl?: string;
  banner?: string;
  bannerUrl?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  companySize?: string;
  location?: string;
  headquarters?: string;
  socialLinks?: Record<string, string>;
  status?: CompanyVerificationStatus;
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
    ownerEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    logo: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    banner: {
      type: String,
    },
    bannerUrl: {
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
    companySize: {
      type: String,
    },
    location: {
      type: String,
      index: true,
    },
    headquarters: {
      type: String,
      index: true,
    },
    socialLinks: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: Object.values(COMPANY_VERIFICATION_STATUS),
      default: COMPANY_VERIFICATION_STATUS.PENDING,
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
companySchema.index({ ownerId: 1 }, { unique: true });
companySchema.index({ slug: 1 }, { unique: true, sparse: true });

export const Company =
  (models.Company as Model<ICompany> | undefined) ??
  model<ICompany>("Company", companySchema);

export default Company;
