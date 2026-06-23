import { Types } from "mongoose";
import { z } from "zod";

const requiredString = z.string().trim().min(1);

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

export const savedJobCreateSchema = z.object({
  jobId: objectIdSchema,
});

export const savedJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "-createdAt"]).default("-createdAt"),
});

export const jobIdParamsSchema = z.object({
  jobId: objectIdSchema,
});

export type SavedJobCreateInput = z.infer<typeof savedJobCreateSchema>;
export type SavedJobsQueryInput = z.infer<typeof savedJobsQuerySchema>;
