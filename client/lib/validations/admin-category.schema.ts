import { z } from "zod";

export const adminCategoryFormSchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(500, "Description must be 500 characters or less").optional(),
  icon: z.string().trim().max(80, "Icon name must be 80 characters or less").optional(),
  status: z.enum(["active", "inactive", "archived", "approved", "flagged"]),
});

export type AdminCategoryFormSchemaValues = z.infer<
  typeof adminCategoryFormSchema
>;
