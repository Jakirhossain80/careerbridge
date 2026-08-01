import { Types } from "mongoose";
import { z } from "zod";

import { SUPPORTED_CURRENCY_CODES } from "../constants/currency.constants.js";
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

const normalizeOptionalString = (value: unknown) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || undefined;
};

const optionalSearchString = z.preprocess(
  normalizeOptionalString,
  z.string().min(1).max(120).optional()
);

const optionalFilterString = z.preprocess(
  normalizeOptionalString,
  z.string().min(1).max(80).optional()
);

const optionalNonNegativeNumber = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : value),
  z.coerce.number().finite().min(0).optional()
);

const optionalDate = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : value),
  z.coerce.date().optional()
);

export const publicJobsQuerySchema = paginationSchema.extend({
  search: optionalSearchString,
  keyword: optionalSearchString,
  title: optionalSearchString,
  company: optionalSearchString,
  skill: optionalSearchString,
  companyId: z.string().trim().refine(Types.ObjectId.isValid, "Invalid company identifier").optional(),
  location: optionalFilterString,
  category: optionalFilterString,
  industry: optionalFilterString,
  experienceLevel: optionalFilterString,
  salaryMin: optionalNonNegativeNumber,
  salaryMax: optionalNonNegativeNumber,
  currency: z.enum(SUPPORTED_CURRENCY_CODES).optional(),
  featured: z.preprocess(
    (value) => value === "true" ? true : value === "false" ? false : value,
    z.boolean().optional()
  ),
  createdFrom: optionalDate,
  createdTo: optionalDate,
  jobType: z.enum(Object.values(JOB_TYPE) as [string, ...string[]]).optional(),
  workMode: z.enum(Object.values(WORK_MODE) as [string, ...string[]]).optional(),
  sort: publicJobSortSchema,
}).superRefine((query, context) => {
  if (
    query.salaryMin !== undefined &&
    query.salaryMax !== undefined &&
    query.salaryMin > query.salaryMax
  ) {
    context.addIssue({
      code: "custom",
      path: ["salaryMin"],
      message: "Minimum salary cannot exceed maximum salary",
    });
  }

  if (query.createdFrom && query.createdTo && query.createdFrom > query.createdTo) {
    context.addIssue({
      code: "custom",
      path: ["createdFrom"],
      message: "Created-from date cannot be after created-to date",
    });
  }
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
