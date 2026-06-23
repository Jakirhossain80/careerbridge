import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid website URL")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const employerAccountSettingsSchema = z.object({
  fullName: z.string().trim().min(2, "Employer name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: optionalTrimmedString,
  avatar: optionalTrimmedString,
  designation: optionalTrimmedString,
});

export const employerCompanySettingsSchema = z.object({
  companyId: z.string().trim(),
  companyName: z.string().trim().min(2, "Company name is required"),
  companyEmail: z.string().trim().email("Enter a valid company email"),
  companyPhone: optionalTrimmedString,
  website: optionalUrl,
  location: optionalTrimmedString,
  industry: optionalTrimmedString,
  companySize: optionalTrimmedString,
});

export const employerNotificationSettingsSchema = z.object({
  newApplicant: z.boolean(),
  interviewReminder: z.boolean(),
  jobExpiry: z.boolean(),
  emailNotifications: z.boolean(),
  dailyDigest: z.boolean(),
});

export const employerPrivacySettingsSchema = z.object({
  companyProfileVisible: z.boolean(),
  jobPostingVisible: z.boolean(),
  contactInfoVisible: z.boolean(),
  showCompanySize: z.boolean(),
  showSalaryRange: z.boolean(),
});

export const employerSettingsSchema = z.object({
  account: employerAccountSettingsSchema,
  company: employerCompanySettingsSchema,
  notifications: employerNotificationSettingsSchema,
  privacy: employerPrivacySettingsSchema,
  team: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.enum(["Owner", "Admin", "Recruiter", "Viewer"]),
      status: z.enum(["Active", "Invited"]),
    }),
  ),
});

export type EmployerSettingsFormValues = z.infer<typeof employerSettingsSchema>;
