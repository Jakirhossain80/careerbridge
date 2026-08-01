import { Types } from "mongoose";

import { COMPANY_VERIFICATION_STATUS } from "../constants/model.constants.js";
import Company from "../models/company.model.js";

export const publicCompanyVisibilityFilter = {
  $or: [
    { status: COMPANY_VERIFICATION_STATUS.APPROVED },
    {
      status: { $exists: false },
      verificationStatus: COMPANY_VERIFICATION_STATUS.APPROVED,
    },
  ],
};

export const publicCompanyProjection = {
  name: 1,
  companyName: 1,
  slug: 1,
  logo: 1,
  logoUrl: 1,
  banner: 1,
  bannerUrl: 1,
  tagline: 1,
  description: 1,
  website: 1,
  industry: 1,
  size: 1,
  companySize: 1,
  location: 1,
  headquarters: 1,
  socialLinks: 1,
} as const;

export const getPublicCompanyIds = async () => {
  const companies = await Company.find(publicCompanyVisibilityFilter).select("_id").lean();
  return companies.map((company) => company._id);
};

export const getPublicCompanyProfile = async (companyId: string) => {
  const filter = Types.ObjectId.isValid(companyId)
    ? { $or: [{ _id: companyId }, { slug: companyId }] }
    : { slug: companyId };

  return Company.findOne({
    $and: [filter, publicCompanyVisibilityFilter],
  }).select(publicCompanyProjection).lean();
};
