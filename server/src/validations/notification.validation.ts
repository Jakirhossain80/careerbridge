import { Types } from "mongoose";
import { z } from "zod";

import { NOTIFICATION_TYPE } from "../constants/model.constants.js";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1);

export const objectIdSchema = requiredString.refine(
  (value) => Types.ObjectId.isValid(value),
  "Invalid MongoDB ObjectId"
);

export const notificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  read: z.coerce.boolean().optional(),
  type: z
    .enum(Object.values(NOTIFICATION_TYPE) as [string, ...string[]])
    .optional(),
});

export const notificationIdParamsSchema = z.object({
  id: objectIdSchema,
});
