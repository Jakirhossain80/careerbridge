import { z } from "zod";

const optionalEmail = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .optional()
  .or(z.literal(""));
const optionalUrl = z
  .string()
  .trim()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

export const adminSettingsSchema = z.object({
  general: z.object({
    platformName: z.string().trim().min(2, "Platform name is required").max(80),
    platformTagline: z.string().trim().max(140).optional(),
    platformDescription: z.string().trim().max(500).optional(),
    contactEmail: optionalEmail,
    supportEmail: optionalEmail,
    contactPhone: z.string().trim().max(30).optional(),
    companyAddress: z.string().trim().max(300).optional(),
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
    senderName: z.string().trim().min(2, "Sender name is required").max(80),
    senderEmail: optionalEmail,
    replyToEmail: optionalEmail,
  }),
  security: z.object({
    sessionTimeoutMinutes: z.coerce
      .number()
      .int("Session timeout must be a whole number")
      .min(5, "Session timeout must be at least 5 minutes")
      .max(1440, "Session timeout must be 1440 minutes or less"),
    loginAttemptLimit: z.coerce
      .number()
      .int("Login attempt limit must be a whole number")
      .min(1, "Login attempt limit must be at least 1")
      .max(20, "Login attempt limit must be 20 or less"),
    minimumPasswordLength: z.coerce
      .number()
      .int("Minimum password length must be a whole number")
      .min(8, "Minimum password length must be at least 8")
      .max(64, "Minimum password length must be 64 or less"),
    requirePasswordUppercase: z.boolean(),
    requirePasswordNumber: z.boolean(),
    requirePasswordSymbol: z.boolean(),
    twoFactorRequired: z.boolean(),
  }),
  seo: z.object({
    defaultSeoTitle: z.string().trim().min(2, "Default SEO title is required").max(70),
    defaultSeoDescription: z.string().trim().max(160).optional(),
    openGraphTitle: z.string().trim().max(70).optional(),
    openGraphDescription: z.string().trim().max(160).optional(),
    openGraphImage: optionalUrl,
  }),
  analytics: z.object({
    analyticsEnabled: z.boolean(),
    trackingEnabled: z.boolean(),
    anonymizeIp: z.boolean(),
    reportingEnabled: z.boolean(),
  }),
});

export type AdminSettingsFormValues = z.infer<typeof adminSettingsSchema>;
