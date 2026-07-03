import { Types } from "mongoose";
import { z } from "zod";

import {
  APPLICATION_STATUS,
  JOB_STATUS,
  JOB_TYPE,
  WORK_MODE,
} from "../constants/model.constants.js";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1);
const optionalString = trimmedString.min(1).optional();
const optionalUrl = trimmedString.url().optional();
const optionalText = trimmedString.optional();
const imageMimeTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

const stringArraySchema = z
  .array(trimmedString.min(1))
  .default([])
  .transform((items) => Array.from(new Set(items)));

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const jobSortSchema = z
  .enum([
    "createdAt",
    "-createdAt",
    "updatedAt",
    "-updatedAt",
    "deadline",
    "-deadline",
    "title",
    "-title",
  ])
  .default("-createdAt");

const applicantSortSchema = z
  .enum(["createdAt", "-createdAt", "updatedAt", "-updatedAt"])
  .default("-createdAt");

export const companyCreateSchema = z.object({
  companyName: requiredString.max(160),
  industry: optionalString,
  companySize: optionalString,
  website: optionalUrl,
  headquarters: optionalString,
  tagline: optionalText,
  description: optionalText,
  logoUrl: optionalUrl,
  bannerUrl: optionalUrl,
  socialLinks: z.record(z.string(), trimmedString.url()).optional(),
});

export const companyUpdateSchema = companyCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one company field is required"
);

export const companyImageUploadSchema = z.object({
  mimeType: imageMimeTypeSchema,
  fileSize: z.coerce.number().int().min(1).max(8 * 1024 * 1024),
});

const baseJobSchema = z.object({
  title: requiredString.max(180),
  description: requiredString,
  responsibilities: stringArraySchema,
  requirements: stringArraySchema,
  skills: stringArraySchema,
  category: optionalString,
  industry: optionalString,
  jobType: z.enum(Object.values(JOB_TYPE) as [string, ...string[]]),
  workplaceType: z.enum(Object.values(WORK_MODE) as [string, ...string[]]),
  location: optionalString,
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  currency: trimmedString.length(3).toUpperCase().default("USD"),
  experienceLevel: optionalString,
  vacancies: z.coerce.number().int().min(1).default(1),
  deadline: z.coerce.date(),
  status: z
    .enum([
      JOB_STATUS.DRAFT,
      JOB_STATUS.PUBLISHED,
      JOB_STATUS.ACTIVE,
    ] as [string, ...string[]])
    .default(JOB_STATUS.PUBLISHED),
  featured: z.coerce.boolean().default(false),
});

export const jobCreateSchema = baseJobSchema
  .refine(
    (value) =>
      value.salaryMin === undefined ||
      value.salaryMax === undefined ||
      value.salaryMin <= value.salaryMax,
    "salaryMin cannot be greater than salaryMax"
  )
  .refine((value) => value.deadline > new Date(), "deadline must be in future");

export const jobUpdateSchema = baseJobSchema
  .partial()
  .extend({
    status: z
      .enum([
        JOB_STATUS.DRAFT,
        JOB_STATUS.PUBLISHED,
        JOB_STATUS.ACTIVE,
        JOB_STATUS.CLOSED,
        JOB_STATUS.ARCHIVED,
      ] as [string, ...string[]])
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one job field is required")
  .refine(
    (value) =>
      value.salaryMin === undefined ||
      value.salaryMax === undefined ||
      value.salaryMin <= value.salaryMax,
    "salaryMin cannot be greater than salaryMax"
  );

export const employerJobsQuerySchema = paginationSchema.extend({
  status: z
    .enum(Object.values(JOB_STATUS) as [string, ...string[]])
    .optional(),
  search: trimmedString.optional(),
  sort: jobSortSchema,
});

export const employerApplicantsQuerySchema = paginationSchema.extend({
  status: z
    .enum(Object.values(APPLICATION_STATUS) as [string, ...string[]])
    .optional(),
  sort: applicantSortSchema,
});

export const applicationStatusUpdateSchema = z.object({
  status: z.enum([
    APPLICATION_STATUS.REVIEWING,
    APPLICATION_STATUS.SHORTLISTED,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.HIRED,
  ] as [string, ...string[]]),
});

export const jobIdParamsSchema = z.object({
  jobId: objectIdSchema,
});

export const applicationIdParamsSchema = z.object({
  applicationId: objectIdSchema,
});
