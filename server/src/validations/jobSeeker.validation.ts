import { Types } from "mongoose";
import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1);
const optionalString = trimmedString.min(1).optional();
const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  trimmedString.url().optional()
);

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

const stringArraySchema = z
  .array(trimmedString.min(1))
  .default([])
  .transform((items) => Array.from(new Set(items)));

const optionalStringArraySchema = stringArraySchema.optional();
const visibilitySchema = z.enum(["public", "recruiters_only", "private"]);

export const profileUpdateSchema = z
  .object({
    fullName: requiredString.max(120).optional(),
    email: trimmedString.email().optional(),
    phone: optionalString,
    avatar: optionalUrl,
    location: optionalString,
    headline: optionalString,
    about: optionalString,
    coverImage: optionalUrl,
    profileCompletion: z.coerce.number().min(0).max(100).optional(),
    yearsOfExperience: z.coerce.number().min(0).optional(),
    currentDesignation: optionalString,
    preferredRole: optionalString,
    skills: optionalStringArraySchema,
    technicalSkills: optionalStringArraySchema,
    softSkills: optionalStringArraySchema,
    experienceLevel: optionalString,
    education: z
      .array(
        z.object({
          _id: optionalString,
          degree: optionalString,
          institution: optionalString,
          fieldOfStudy: optionalString,
          graduationYear: z.coerce.number().int().min(1900).max(2100).optional(),
          startYear: z.coerce.number().int().min(1900).max(2100).optional(),
          endYear: z.coerce.number().int().min(1900).max(2100).optional(),
        })
      )
      .optional(),
    experience: z
      .array(
        z.object({
          _id: optionalString,
          title: requiredString.max(120),
          company: requiredString.max(120),
          employmentType: optionalString,
          startDate: optionalString,
          endDate: optionalString,
          currentlyWorking: z.coerce.boolean().optional(),
          location: optionalString,
          description: optionalString,
        })
      )
      .optional(),
    projects: z
      .array(
        z.object({
          _id: optionalString,
          title: requiredString.max(160),
          description: optionalString,
          imageUrl: optionalUrl,
          projectUrl: optionalUrl,
          githubUrl: optionalUrl,
          technologies: optionalStringArraySchema,
        })
      )
      .optional(),
    portfolioUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    githubUrl: optionalUrl,
    otherLinks: z
      .array(
        z.object({
          label: requiredString.max(80),
          url: trimmedString.url(),
        })
      )
      .optional(),
    preferredJobTypes: optionalStringArraySchema,
    preferredWorkModes: optionalStringArraySchema,
    preferredCategories: optionalStringArraySchema,
    preferredLocations: optionalStringArraySchema,
    expectedSalaryMin: z.coerce.number().min(0).optional(),
    expectedSalaryMax: z.coerce.number().min(0).optional(),
    language: optionalString,
    timeZone: optionalString,
    linkedProfiles: z
      .array(
        z.object({
          provider: requiredString.max(80),
          email: trimmedString.email().optional(),
        })
      )
      .optional(),
    notificationPreferences: z
      .object({
        enableNotifications: z.coerce.boolean(),
        emailNotifications: z.coerce.boolean(),
        applicationUpdates: z.coerce.boolean(),
        interviewNotifications: z.coerce.boolean(),
        interviewReminders: z.coerce.boolean(),
        jobAlerts: z.coerce.boolean(),
        recommendedJobs: z.coerce.boolean(),
      })
      .partial()
      .optional(),
    privacySettings: z
      .object({
        profileVisibility: visibilitySchema,
        resumeVisibility: visibilitySchema,
        contactInfoVisible: z.coerce.boolean(),
        publicSearchVisible: z.coerce.boolean(),
      })
      .partial()
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one profile field is required")
  .refine(
    (value) =>
      value.expectedSalaryMin === undefined ||
      value.expectedSalaryMax === undefined ||
      value.expectedSalaryMin <= value.expectedSalaryMax,
    "expectedSalaryMin cannot be greater than expectedSalaryMax"
  );

export const resumeUploadSchema = z.object({
  fileName: requiredString.max(255),
  fileUrl: requiredString,
  fileType: requiredString.max(120),
  fileSize: z.coerce.number().int().min(1).max(10 * 1024 * 1024),
  isDefault: z.coerce.boolean().default(false),
});

export const avatarUploadSchema = z.object({
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.coerce.number().int().min(1).max(5 * 1024 * 1024),
});

export const resumeIdParamsSchema = z.object({
  resumeId: objectIdSchema,
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;
export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>;
