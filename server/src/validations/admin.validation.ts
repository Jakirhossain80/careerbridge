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
  severity: trimmedString.optional(),
  reason: trimmedString.optional(),
  targetType: trimmedString.optional(),
  reporter: trimmedString.optional(),
  assignedModerator: trimmedString.optional(),
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

export const adminAnalyticsQuerySchema = z.object({
  dateRange: z
    .enum([
      "today",
      "last_7_days",
      "last_30_days",
      "last_90_days",
      "last_12_months",
      "custom",
    ])
    .default("last_30_days"),
  dateFrom: trimmedString.optional(),
  dateTo: trimmedString.optional(),
  category: trimmedString.optional(),
  company: trimmedString.optional(),
  employer: trimmedString.optional(),
  location: trimmedString.optional(),
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

export const adminPendingEmployerQuerySchema = z.object({
  search: trimmedString.optional(),
  verificationStatus: trimmedString.optional(),
  accountStatus: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
  industry: trimmedString.optional(),
  companySize: trimmedString.optional(),
  dateFrom: trimmedString.optional(),
  dateTo: trimmedString.optional(),
  submittedFrom: trimmedString.optional(),
  submittedTo: trimmedString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(["createdAt", "-createdAt", "updatedAt", "-updatedAt", "name", "-name"])
    .default("-createdAt"),
});

export const adminCompanyQuerySchema = z.object({
  search: trimmedString.optional(),
  verificationStatus: trimmedString.optional(),
  companyStatus: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
  industry: trimmedString.optional(),
  companySize: trimmedString.optional(),
  dateFrom: trimmedString.optional(),
  dateTo: trimmedString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(["createdAt", "-createdAt", "updatedAt", "-updatedAt", "name", "-name", "activeJobsCount", "-activeJobsCount"])
    .default("-createdAt"),
});

export const companyStatusUpdateSchema = z.object({
  status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]),
});

export const companyVerificationUpdateSchema = z.object({
  verificationStatus: z
    .enum(Object.values(COMPANY_VERIFICATION_STATUS) as [string, ...string[]]),
});

export const idParamSchema = z.object({
  userId: objectIdSchema.optional(),
  jobSeekerId: objectIdSchema.optional(),
  employerId: objectIdSchema.optional(),
  companyId: objectIdSchema.optional(),
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
  excerpt: trimmedString.max(300).optional(),
  content: requiredString,
  featuredImage: trimmedString.url().optional(),
  category: optionalString,
  tags: z.array(trimmedString.min(1).max(60)).max(20).optional(),
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]])
    .default(BLOG_STATUS.DRAFT),
  featured: z.boolean().optional(),
  seoTitle: trimmedString.max(70).optional(),
  seoDescription: trimmedString.max(160).optional(),
});

export const blogUpdateSchema = blogCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one blog field is required");

export const reportStatusUpdateSchema = z.object({
  status: z.enum(Object.values(REPORT_STATUS) as [string, ...string[]]),
  resolutionNote: trimmedString.max(1000).optional(),
  moderatorNote: trimmedString.max(1000).optional(),
});

export const reportModerationActionSchema = z.object({
  moderatorNote: trimmedString.max(1000).optional(),
  resolutionNote: trimmedString.max(1000).optional(),
});

const optionalEmail = z.string().trim().email().optional().or(z.literal(""));
const optionalUrl = z.string().trim().url().optional().or(z.literal(""));

export const adminSettingsSchema = z.object({
  general: z.object({
    platformName: requiredString.max(80),
    platformTagline: trimmedString.max(140).optional(),
    platformDescription: trimmedString.max(500).optional(),
    contactEmail: optionalEmail,
    supportEmail: optionalEmail,
    contactPhone: trimmedString.max(30).optional(),
    companyAddress: trimmedString.max(300).optional(),
  }),
  platform: z.object({
    maintenanceMode: z.boolean(),
    publicRegistrationEnabled: z.boolean(),
    employerRegistrationEnabled: z.boolean(),
    jobPostingEnabled: z.boolean(),
    blogModuleEnabled: z.boolean(),
  }),
  authentication: z.object({
    emailLoginEnabled: z.boolean(),
    googleLoginEnabled: z.boolean(),
    passwordResetEnabled: z.boolean(),
    emailVerificationRequired: z.boolean(),
  }),
  registration: z.object({
    autoApproveJobSeekers: z.boolean(),
    requireProfileCompletion: z.boolean(),
    resumeUploadRequirement: z.boolean(),
  }),
  employerApproval: z.object({
    employerVerificationRequired: z.boolean(),
    manualEmployerApproval: z.boolean(),
    companyVerificationRequired: z.boolean(),
  }),
  jobApproval: z.object({
    manualJobApproval: z.boolean(),
    autoPublishJobs: z.boolean(),
    featuredJobRequirements: z.boolean(),
  }),
  blog: z.object({
    blogPublishingEnabled: z.boolean(),
    commentingEnabled: z.boolean(),
    featuredBlogsEnabled: z.boolean(),
  }),
  notifications: z.object({
    emailNotifications: z.boolean(),
    applicationNotifications: z.boolean(),
    interviewNotifications: z.boolean(),
    adminNotifications: z.boolean(),
  }),
  email: z.object({
    senderName: requiredString.max(80),
    senderEmail: optionalEmail,
    replyToEmail: optionalEmail,
  }),
  security: z.object({
    sessionTimeoutMinutes: z.number().int().min(5).max(1440),
    loginAttemptLimit: z.number().int().min(1).max(20),
    minimumPasswordLength: z.number().int().min(8).max(64),
    requirePasswordUppercase: z.boolean(),
    requirePasswordNumber: z.boolean(),
    requirePasswordSymbol: z.boolean(),
    twoFactorRequired: z.boolean(),
  }),
  seo: z.object({
    defaultSeoTitle: requiredString.max(70),
    defaultSeoDescription: trimmedString.max(160).optional(),
    openGraphTitle: trimmedString.max(70).optional(),
    openGraphDescription: trimmedString.max(160).optional(),
    openGraphImage: optionalUrl,
  }),
  analytics: z.object({
    analyticsEnabled: z.boolean(),
    trackingEnabled: z.boolean(),
    anonymizeIp: z.boolean(),
    reportingEnabled: z.boolean(),
  }),
});
