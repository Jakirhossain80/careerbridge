import { Types } from "mongoose";
import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1);

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

export const applicationCreateSchema = z
  .object({
    jobId: objectIdSchema,
    resumeId: objectIdSchema.optional(),
    resumeUrl: trimmedString.min(1).optional(),
    coverLetter: trimmedString.max(3000).optional(),
  })
  .refine(
    (value) => Boolean(value.resumeId || value.resumeUrl),
    "resumeId or resumeUrl is required"
  );

export const applicationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: trimmedString.optional(),
  search: trimmedString.optional(),
  sortBy: z.enum(["createdAt", "-createdAt", "updatedAt", "-updatedAt"]).default("-createdAt"),
});

export const applicationIdParamsSchema = z.object({
  applicationId: objectIdSchema,
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type ApplicationsQueryInput = z.infer<typeof applicationsQuerySchema>;
