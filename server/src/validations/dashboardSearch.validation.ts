import { z } from "zod";

const normalizedQuery = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(2, "Search query must contain at least 2 characters")
      .max(80, "Search query must contain at most 80 characters")
  );

export const dashboardSearchQuerySchema = z.object({
  q: normalizedQuery,
  limitPerCategory: z.coerce.number().int().min(1).max(8).default(5),
});

export type DashboardSearchQuery = z.infer<typeof dashboardSearchQuerySchema>;
