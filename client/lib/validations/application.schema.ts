import { z } from "zod";

export const applicationNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(3, "Note must be at least 3 characters")
    .max(1000, "Note must be less than 1000 characters"),
});

export type ApplicationNoteFormValues = z.infer<typeof applicationNoteSchema>;
