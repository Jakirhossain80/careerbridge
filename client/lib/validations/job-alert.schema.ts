import { z } from "zod";

export const jobAlertSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  keyword: z.string().trim().optional(),
  location: z.string().trim().optional(),
  category: z.string().trim().optional(),
  jobType: z.string().trim().optional(),
  workMode: z.string().trim().optional(),
  frequency: z.enum(["daily", "weekly"]),
  isActive: z.boolean().optional(),
});

export type JobAlertFormValues = z.infer<typeof jobAlertSchema>;
