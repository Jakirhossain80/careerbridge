import { Types } from "mongoose";

import Company from "../models/company.model.js";

export const getPublicCompanyProfile = async (companyId: string) => {
  const filter = Types.ObjectId.isValid(companyId)
    ? { $or: [{ _id: companyId }, { slug: companyId }] }
    : { slug: companyId };

  return Company.findOne(filter).lean();
};
