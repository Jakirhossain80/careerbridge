import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  photoURL: z
    .string()
    .trim()
    .url("Enter a valid image URL.")
    .or(z.literal(""))
    .optional(),
  profileCompleted: z.boolean().optional(),
});

export type AdminUserUpdateFormValues = z.infer<typeof adminUserUpdateSchema>;
