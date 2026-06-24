import { z } from "zod";

const optionalTrimmedString = z.string().trim().optional();

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || z.string().url().safeParse(value).success,
    "Enter a valid URL",
  );

const experienceSchema = z
  .object({
    _id: optionalTrimmedString,
    title: z.string().trim().min(1, "Job title is required"),
    company: z.string().trim().min(1, "Company name is required"),
    employmentType: optionalTrimmedString,
    startDate: optionalTrimmedString,
    endDate: optionalTrimmedString,
    currentlyWorking: z.boolean().optional(),
    location: optionalTrimmedString,
    description: optionalTrimmedString,
  })
  .refine(
    (value) => value.currentlyWorking || Boolean(value.endDate) || !value.startDate,
    {
      path: ["endDate"],
      message: "Add an end date or mark this as current",
    },
  );

const educationSchema = z.object({
  _id: optionalTrimmedString,
  degree: z.string().trim().min(1, "Degree is required"),
  institution: z.string().trim().min(1, "Institution is required"),
  fieldOfStudy: optionalTrimmedString,
  graduationYear: optionalTrimmedString,
});

export const jobSeekerProfileSchema = z.object({
  avatar: optionalUrl,
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: optionalTrimmedString,
  location: optionalTrimmedString,
  headline: optionalTrimmedString,
  about: z
    .string()
    .trim()
    .max(2000, "About section must be less than 2000 characters")
    .optional(),
  currentDesignation: optionalTrimmedString,
  yearsOfExperience: optionalTrimmedString,
  preferredRole: optionalTrimmedString,
  technicalSkills: z.array(z.string().trim().min(1)).optional(),
  softSkills: z.array(z.string().trim().min(1)).optional(),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
});

export type JobSeekerProfileFormValues = z.infer<typeof jobSeekerProfileSchema>;
