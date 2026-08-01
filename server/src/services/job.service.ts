import { Types, type QueryFilter, type SortOrder } from "mongoose";

import { JOB_STATUS } from "../constants/model.constants.js";
import Job, { type IJob } from "../models/job.model.js";
import AppError from "../utils/AppError.js";
import type { PublicJobsQuery } from "../validations/job.validation.js";
import { getPublicCompanyIds } from "./company.service.js";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const MAX_GLOBAL_SEARCH_TOKENS = 8;

export const tokenizeGlobalSearch = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, MAX_GLOBAL_SEARCH_TOKENS);

export const publicJobProjection = {
  companyId: 1,
  companyName: 1,
  title: 1,
  slug: 1,
  description: 1,
  responsibilities: 1,
  requirements: 1,
  skills: 1,
  category: 1,
  industry: 1,
  salary: 1,
  salaryMin: 1,
  salaryMax: 1,
  currency: 1,
  jobType: 1,
  workMode: 1,
  workplaceType: 1,
  location: 1,
  deadline: 1,
  experienceLevel: 1,
  vacancies: 1,
  featured: 1,
  applicationsCount: 1,
  createdAt: 1,
  updatedAt: 1,
} as const;

const getPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

const buildSort = (sort: string): Record<string, SortOrder> => {
  const direction = sort.startsWith("-") ? -1 : 1;
  const field = sort.replace(/^-/, "");

  return { [field]: direction };
};

export const buildPublicJobFilter = (
  query: PublicJobsQuery,
  publicCompanyIds: Types.ObjectId[],
) => {
  const eligibleCompanyIds = query.companyId
    ? publicCompanyIds.filter((companyId) => companyId.equals(query.companyId))
    : publicCompanyIds;
  const filter: QueryFilter<IJob> = {
    companyId: { $in: eligibleCompanyIds },
    status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
    deadline: { $gte: new Date() },
  };

  const globalTokens = [query.search, query.keyword]
    .filter((term): term is string => Boolean(term))
    .flatMap(tokenizeGlobalSearch);

  if (globalTokens.length > 0) {
    filter.$and = [
      ...(filter.$and ?? []),
      ...globalTokens.map((token) => ({
        $or: [
          { title: new RegExp(escapeRegex(token), "i") },
          { companyName: new RegExp(escapeRegex(token), "i") },
          { description: new RegExp(escapeRegex(token), "i") },
          { category: new RegExp(escapeRegex(token), "i") },
          { industry: new RegExp(escapeRegex(token), "i") },
          { skills: new RegExp(escapeRegex(token), "i") },
        ],
      })),
    ];
  }

  if (query.title) filter.title = new RegExp(escapeRegex(query.title), "i");
  if (query.company) filter.companyName = new RegExp(escapeRegex(query.company), "i");
  if (query.skill) filter.skills = new RegExp(escapeRegex(query.skill), "i");

  if (query.location) {
    filter.location = new RegExp(escapeRegex(query.location), "i");
  }

  if (query.category) {
    filter.category = new RegExp(`^${escapeRegex(query.category)}$`, "i");
  }

  if (query.industry) {
    filter.industry = new RegExp(`^${escapeRegex(query.industry)}$`, "i");
  }

  if (query.experienceLevel) {
    filter.experienceLevel = new RegExp(`^${escapeRegex(query.experienceLevel)}$`, "i");
  }

  if (query.jobType) {
    filter.jobType = query.jobType as IJob["jobType"];
  }

  if (query.workMode) {
    filter.workMode = query.workMode as IJob["workMode"];
  }

  if (query.featured !== undefined) filter.featured = query.featured;
  if (query.currency) {
    filter.$and = [
      ...(filter.$and ?? []),
      { $or: [{ currency: query.currency }, { "salary.currency": query.currency }] },
    ];
  }

  if (query.salaryMin !== undefined) {
    filter.$and = [
      ...(filter.$and ?? []),
      { $or: [{ salaryMax: { $gte: query.salaryMin } }, { "salary.max": { $gte: query.salaryMin } }] },
    ];
  }

  if (query.salaryMax !== undefined) {
    filter.$and = [
      ...(filter.$and ?? []),
      { $or: [{ salaryMin: { $lte: query.salaryMax } }, { "salary.min": { $lte: query.salaryMax } }] },
    ];
  }

  if (query.createdFrom || query.createdTo) {
    filter.createdAt = {
      ...(query.createdFrom ? { $gte: query.createdFrom } : {}),
      ...(query.createdTo ? { $lte: query.createdTo } : {}),
    };
  }

  return filter;
};

export const getPublicJobs = async (query: PublicJobsQuery) => {
  const publicCompanyIds = await getPublicCompanyIds();
  const filter = buildPublicJobFilter(query, publicCompanyIds);
  const skip = (query.page - 1) * query.limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .select(publicJobProjection)
      .sort(buildSort(query.sort))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const getFeaturedPublicJobs = async (query: PublicJobsQuery) => {
  const publicCompanyIds = await getPublicCompanyIds();
  const filter = {
    ...buildPublicJobFilter(query, publicCompanyIds),
    featured: true,
  };
  const skip = (query.page - 1) * query.limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .select(publicJobProjection)
      .sort(buildSort(query.sort))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const getPublicJobByIdentifier = async (idOrSlug: string) => {
  const publicCompanyIds = await getPublicCompanyIds();
  const identifierFilter = Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const job = await Job.findOne({
    ...identifierFilter,
    companyId: { $in: publicCompanyIds },
    status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
    deadline: { $gte: new Date() },
  }).select(publicJobProjection).lean();

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
};
