import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalNumber = z
  .union([
    z.number().min(0, "Salary cannot be negative"),
    z.nan().transform(() => undefined),
  ])
  .optional();

export const accountPreferencesSchema = z.object({
  currentEmail: optionalEmail,
  newEmail: optionalEmail,
  phone: optionalTrimmedString,
  linkedProfiles: z
    .array(
      z.object({
        provider: z.string().trim(),
        email: optionalEmail,
      }),
    )
    .optional(),
  language: optionalTrimmedString,
  timeZone: optionalTrimmedString,
});

export const notificationPreferencesSchema = z.object({
  enableNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  applicationUpdates: z.boolean(),
  interviewNotifications: z.boolean(),
  interviewReminders: z.boolean(),
  jobAlerts: z.boolean(),
  recommendedJobs: z.boolean(),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(
    ["public", "recruiters_only", "private"],
    "Please select profile visibility",
  ),
  resumeVisibility: z.enum(
    ["public", "recruiters_only", "private"],
    "Please select resume visibility",
  ),
  contactInfoVisible: z.boolean(),
  publicSearchVisible: z.boolean(),
});

export const jobPreferencesSchema = z
  .object({
    preferredCategories: z.array(z.string().trim()).optional(),
    preferredLocations: z.array(z.string().trim()).optional(),
    preferredEmploymentTypes: z.array(z.string().trim()).optional(),
    preferredWorkModes: z.array(z.string().trim()).optional(),
    expectedSalaryMin: optionalNumber,
    expectedSalaryMax: optionalNumber,
  })
  .refine(
    (value) =>
      value.expectedSalaryMin === undefined ||
      value.expectedSalaryMax === undefined ||
      value.expectedSalaryMin <= value.expectedSalaryMax,
    {
      message: "Maximum salary must be greater than minimum salary",
      path: ["expectedSalaryMax"],
    },
  );

export const userSettingsSchema = z.object({
  _id: optionalTrimmedString,
  userId: optionalTrimmedString,
  accountPreferences: accountPreferencesSchema,
  notificationPreferences: notificationPreferencesSchema,
  privacySettings: privacySettingsSchema,
  jobPreferences: jobPreferencesSchema.optional(),
  updatedAt: optionalTrimmedString,
});

export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;
