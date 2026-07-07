import { Types } from "mongoose";
import { z } from "zod";

import { JOB_TYPE, WORK_MODE } from "../constants/model.constants.js";

const trimmedString = z.string().trim();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

const publicJobSortSchema = z
  .enum([
    "createdAt",
    "-createdAt",
    "deadline",
    "-deadline",
    "salaryMin",
    "-salaryMin",
    "applicationsCount",
    "-applicationsCount",
  ])
  .default("-createdAt");

const optionalSearchString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  trimmedString.optional()
);

export const publicJobsQuerySchema = paginationSchema.extend({
  search: optionalSearchString,
  keyword: optionalSearchString,
  title: optionalSearchString,
  company: optionalSearchString,
  skill: optionalSearchString,
  location: optionalSearchString,
  category: optionalSearchString,
  jobType: z.enum(Object.values(JOB_TYPE) as [string, ...string[]]).optional(),
  workMode: z.enum(Object.values(WORK_MODE) as [string, ...string[]]).optional(),
  sort: publicJobSortSchema,
});

export const publicJobIdentifierParamsSchema = z.object({
  idOrSlug: trimmedString
    .min(1)
    .refine(
      (value) => Types.ObjectId.isValid(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      "Invalid job identifier"
    ),
});

export type PublicJobsQuery = z.infer<typeof publicJobsQuerySchema>;
