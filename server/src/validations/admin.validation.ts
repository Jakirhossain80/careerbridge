import { Types } from "mongoose";
import { z } from "zod";

import {
  APPLICATION_STATUS,
  BLOG_STATUS,
  CATEGORY_STATUS,
  COMPANY_VERIFICATION_STATUS,
  JOB_STATUS,
  REPORT_STATUS,
  USER_ROLES,
  USER_STATUS,
} from "../constants/model.constants.js";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1);
const optionalString = trimmedString.min(1).optional();

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

export const paginationQuerySchema = z.object({
  search: trimmedString.optional(),
  role: z
    .enum(Object.values(USER_ROLES) as [string, ...string[]])
    .or(z.literal("admins"))
    .optional(),
  status: trimmedString.optional(),
  dateFrom: trimmedString.optional(),
  dateTo: trimmedString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum([
      "createdAt",
      "-createdAt",
      "updatedAt",
      "-updatedAt",
      "name",
      "-name",
      "title",
      "-title",
      "email",
      "-email",
    ])
    .default("-createdAt"),
});

export const adminJobSeekerQuerySchema = z.object({
  search: trimmedString.optional(),
  status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
  resumeStatus: z
    .enum(["uploaded", "missing", "processing", "active"] as [string, ...string[]])
    .optional(),
  profileCompletion: z
    .enum(["under_50", "50_79", "80_100", "complete", "incomplete"] as [
      string,
      ...string[],
    ])
    .optional(),
  location: trimmedString.optional(),
  dateFrom: trimmedString.optional(),
  dateTo: trimmedString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum([
      "createdAt",
      "-createdAt",
      "name",
      "-name",
      "profileCompletion",
      "-profileCompletion",
    ])
    .default("-createdAt"),
});

export const idParamSchema = z.object({
  userId: objectIdSchema.optional(),
  jobSeekerId: objectIdSchema.optional(),
  employerId: objectIdSchema.optional(),
  jobId: objectIdSchema.optional(),
  applicationId: objectIdSchema.optional(),
  categoryId: objectIdSchema.optional(),
  blogId: objectIdSchema.optional(),
  reportId: objectIdSchema.optional(),
});

export const jobSeekerUpdateSchema = z
  .object({
    name: optionalString,
    photoURL: trimmedString.url().optional(),
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
    phone: optionalString,
    location: optionalString,
    professionalHeadline: optionalString,
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one job seeker field is required"
  );

export const jobSeekerStatusUpdateSchema = z.object({
  status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]),
});

export const userUpdateSchema = z
  .object({
    name: optionalString,
    photoURL: trimmedString.url().optional(),
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
    profileCompleted: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one user field is required");

export const roleChangeSchema = z.object({
  role: z.enum([
    USER_ROLES.JOB_SEEKER,
    USER_ROLES.EMPLOYER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
  ] as [string, ...string[]]),
});

export const employerUpdateSchema = z
  .object({
    name: optionalString,
    companyName: optionalString,
    industry: optionalString,
    size: optionalString,
    companySize: optionalString,
    website: trimmedString.url().optional(),
    location: optionalString,
    headquarters: optionalString,
    description: optionalString,
    verificationStatus: z
      .enum(Object.values(COMPANY_VERIFICATION_STATUS) as [string, ...string[]])
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one employer field is required");

export const moderationReasonSchema = z.object({
  reason: trimmedString.max(1000).optional(),
});

export const jobUpdateSchema = z
  .object({
    title: optionalString,
    description: optionalString,
    category: optionalString,
    industry: optionalString,
    location: optionalString,
    status: z.enum(Object.values(JOB_STATUS) as [string, ...string[]]).optional(),
    featured: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one job field is required");

export const applicationUpdateSchema = z
  .object({
    status: z
      .enum(Object.values(APPLICATION_STATUS) as [string, ...string[]])
      .optional(),
    note: trimmedString.max(1000).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one application field is required"
  );

export const categoryCreateSchema = z.object({
  name: requiredString.max(120),
  slug: optionalString,
  icon: optionalString,
  status: z
    .enum(Object.values(CATEGORY_STATUS) as [string, ...string[]])
    .default(CATEGORY_STATUS.ACTIVE),
});

export const categoryUpdateSchema = categoryCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one category field is required");

export const blogCreateSchema = z.object({
  title: requiredString.max(180),
  slug: optionalString,
  content: requiredString,
  category: optionalString,
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]])
    .default(BLOG_STATUS.DRAFT),
});

export const blogUpdateSchema = blogCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one blog field is required");

export const reportStatusUpdateSchema = z.object({
  status: z.enum(Object.values(REPORT_STATUS) as [string, ...string[]]),
  resolutionNote: trimmedString.max(1000).optional(),
});
