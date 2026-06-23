import { Types } from "mongoose";
import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1);

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

export const jobAlertCreateSchema = z.object({
  title: requiredString.max(160),
  keyword: trimmedString.min(1).optional(),
  location: trimmedString.min(1).optional(),
  category: trimmedString.min(1).optional(),
  jobType: trimmedString.min(1).optional(),
  workMode: trimmedString.min(1).optional(),
  frequency: z.enum(["daily", "weekly"]),
  isActive: z.coerce.boolean().default(true),
});

export const jobAlertUpdateSchema = jobAlertCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one alert field is required");

export const jobAlertsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const alertIdParamsSchema = z.object({
  alertId: objectIdSchema,
});

export type JobAlertCreateInput = z.infer<typeof jobAlertCreateSchema>;
export type JobAlertUpdateInput = z.infer<typeof jobAlertUpdateSchema>;
export type JobAlertsQueryInput = z.infer<typeof jobAlertsQuerySchema>;
