import { z } from "zod";

export const RESUME_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

export const RESUME_MAX_FILE_SIZE = 5 * 1024 * 1024;

export const resumeUploadSchema = z.object({
  file: z
    .custom<File>(
      (file) => typeof File !== "undefined" && file instanceof File,
      "Resume file is required",
    )
    .refine(
      (file) => RESUME_ALLOWED_MIME_TYPES.includes(
        file.type as (typeof RESUME_ALLOWED_MIME_TYPES)[number],
      ),
      "Only PDF, DOC, and DOCX files are allowed",
    )
    .refine(
      (file) => file.size <= RESUME_MAX_FILE_SIZE,
      "File size must be 5MB or less",
    ),
});

export type ResumeUploadFormValues = z.infer<typeof resumeUploadSchema>;
