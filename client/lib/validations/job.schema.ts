import { z } from "zod";

export const jobFormSchema = z
  .object({
    title: z.string().trim().min(1, "Job title is required"),
    category: z.string().trim().min(1, "Category is required"),
    jobType: z.enum([
      "full_time",
      "part_time",
      "contract",
      "internship",
      "temporary",
      "freelance",
    ], "Please select a job type"),
    workMode: z.enum(["remote", "onsite", "hybrid"], "Please select a work mode"),
    location: z.string().trim().optional(),
    salaryMin: z.number().min(0, "Minimum salary must be zero or greater").optional(),
    salaryMax: z.number().min(0, "Maximum salary must be zero or greater").optional(),
    currency: z
      .string()
      .trim()
      .length(3, "Use a 3-letter currency code"),
    experienceLevel: z.string().trim().optional(),
    educationLevel: z.string().trim().optional(),
    openings: z.number().int().min(1, "Openings must be at least 1"),
    applicationDeadline: z.string().trim().min(1, "Application deadline is required"),
    skills: z.string().trim().optional(),
    description: z.string().trim().min(1, "Description is required"),
    responsibilities: z.string().trim().min(1, "Responsibilities are required"),
    requirements: z.string().trim().min(1, "Requirements are required"),
    benefits: z.string().trim().optional(),
    status: z.enum(
      ["draft", "pending", "published", "active", "closed", "archived"],
      "Please select a job status",
    ),
    isPublished: z.boolean(),
  })
  .refine(
    (value) => value.workMode === "remote" || Boolean(value.location?.trim()),
    {
      message: "Location is required unless the job is remote",
      path: ["location"],
    },
  )
  .refine(
    (value) =>
      value.salaryMin === undefined ||
      value.salaryMax === undefined ||
      value.salaryMax >= value.salaryMin,
    {
      message: "Salary maximum cannot be less than salary minimum",
      path: ["salaryMax"],
    },
  );

export type JobFormValues = z.infer<typeof jobFormSchema>;
