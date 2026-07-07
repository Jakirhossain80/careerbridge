import { Types, type QueryFilter, type SortOrder } from "mongoose";

import { JOB_STATUS } from "../constants/model.constants.js";
import Job, { type IJob } from "../models/job.model.js";
import AppError from "../utils/AppError.js";
import type { PublicJobsQuery } from "../validations/job.validation.js";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

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

const buildPublicJobFilter = (query: PublicJobsQuery = {} as PublicJobsQuery) => {
  const filter: QueryFilter<IJob> = {
    status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
    deadline: { $gte: new Date() },
  };

  const textTerms = [
    query.search,
    query.keyword,
    query.title,
    query.company,
    query.skill,
  ].filter((term): term is string => Boolean(term));

  if (textTerms.length > 0) {
    const regexes = textTerms.map((term) => new RegExp(escapeRegex(term), "i"));
    filter.$and = [
      ...(filter.$and ?? []),
      ...regexes.map((regex) => ({
        $or: [
          { title: regex },
          { companyName: regex },
          { description: regex },
          { category: regex },
          { industry: regex },
          { skills: regex },
        ],
      })),
    ];
  }

  if (query.location) {
    filter.location = new RegExp(escapeRegex(query.location), "i");
  }

  if (query.category) {
    filter.category = new RegExp(`^${escapeRegex(query.category)}$`, "i");
  }

  if (query.jobType) {
    filter.jobType = query.jobType as IJob["jobType"];
  }

  if (query.workMode) {
    filter.workMode = query.workMode as IJob["workMode"];
  }

  return filter;
};

export const getPublicJobs = async (query: PublicJobsQuery) => {
  const filter = buildPublicJobFilter(query);
  const skip = (query.page - 1) * query.limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
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
  const filter = {
    ...buildPublicJobFilter(query),
    featured: true,
  };
  const skip = (query.page - 1) * query.limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
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
  const identifierFilter = Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const job = await Job.findOne({
    ...identifierFilter,
    status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
    deadline: { $gte: new Date() },
  }).lean();

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
};
