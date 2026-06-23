import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || z.string().url().safeParse(value).success, "Enter a valid URL");

export const jobSeekerProfileSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().optional(),
    location: z.string().trim().optional(),
    headline: z.string().trim().optional(),
    about: z.string().trim().optional(),
    skillsText: z.string().trim().optional(),
    experienceLevel: z.string().trim().optional(),
    portfolioUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    githubUrl: optionalUrl,
    preferredJobTypesText: z.string().trim().optional(),
    preferredWorkModesText: z.string().trim().optional(),
    expectedSalaryMin: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0).optional()
    ),
    expectedSalaryMax: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0).optional()
    ),
  })
  .refine(
    (value) =>
      !value.expectedSalaryMin ||
      !value.expectedSalaryMax ||
      Number(value.expectedSalaryMin) <= Number(value.expectedSalaryMax),
    "Minimum salary cannot be greater than maximum salary"
  );

export type JobSeekerProfileFormValues = z.infer<typeof jobSeekerProfileSchema>;
