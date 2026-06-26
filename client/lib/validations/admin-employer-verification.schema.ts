import { z } from "zod";

export const rejectEmployerSchema = z.object({
  reasonCategory: z.string().trim().min(1, "Select a rejection category."),
  reason: z
    .string()
    .trim()
    .min(10, "Add at least 10 characters of detail.")
    .max(1000, "Keep the explanation under 1000 characters."),
});

export type RejectEmployerFormValues = z.infer<typeof rejectEmployerSchema>;
