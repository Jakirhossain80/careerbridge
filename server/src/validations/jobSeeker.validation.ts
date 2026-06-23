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

export const profileUpdateSchema = z
  .object({
    fullName: requiredString.max(120).optional(),
    email: trimmedString.email().optional(),
    phone: optionalString,
    avatar: optionalUrl,
    location: optionalString,
    headline: optionalString,
    about: optionalString,
    skills: stringArraySchema.optional(),
    experienceLevel: optionalString,
    education: z
      .array(
        z.object({
          degree: optionalString,
          institution: optionalString,
          graduationYear: z.coerce.number().int().min(1900).max(2100).optional(),
        })
      )
      .optional(),
    experience: z
      .array(
        z.object({
          title: requiredString.max(120),
          company: requiredString.max(120),
          startDate: optionalString,
          endDate: optionalString,
          currentlyWorking: z.coerce.boolean().optional(),
          description: optionalString,
        })
      )
      .optional(),
    portfolioUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    githubUrl: optionalUrl,
    preferredJobTypes: stringArraySchema.optional(),
    preferredWorkModes: stringArraySchema.optional(),
    expectedSalaryMin: z.coerce.number().min(0).optional(),
    expectedSalaryMax: z.coerce.number().min(0).optional(),
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

export const resumeIdParamsSchema = z.object({
  resumeId: objectIdSchema,
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;
