import { z } from "zod";

export const applicationNoteSchema = z.object({
  note: z.string().trim().min(1, "Note is required").max(1000, "Note must be 1000 characters or fewer"),
});

export const applyJobSchema = z
  .object({
    jobId: z.string().trim().min(1, "Job is required"),
    resumeId: z.string().trim().optional(),
    resumeUrl: z.string().trim().optional(),
    coverLetter: z.string().max(3000, "Cover letter must be 3000 characters or fewer").optional(),
  })
  .refine((value) => Boolean(value.resumeId || value.resumeUrl), {
    message: "Select a resume or provide a resume URL",
    path: ["resumeId"],
  });

export type ApplyJobFormValues = z.infer<typeof applyJobSchema>;
export type ApplicationNoteFormValues = z.infer<typeof applicationNoteSchema>;
