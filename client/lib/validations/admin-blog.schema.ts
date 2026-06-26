import { z } from "zod";

export const adminBlogFormSchema = z.object({
  title: z.string().trim().min(3, "Blog title is required").max(180),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens")
    .optional()
    .or(z.literal("")),
  excerpt: z.string().trim().max(300, "Excerpt must be 300 characters or less").optional(),
  content: z.string().trim().min(20, "Blog content must be at least 20 characters"),
  featuredImage: z.string().trim().url("Use a valid image URL").optional().or(z.literal("")),
  category: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  status: z.enum(["draft", "scheduled", "published", "unpublished", "archived"]),
  featuredStatus: z.enum(["featured", "not_featured"]),
  seoTitle: z.string().trim().max(70, "SEO title should be 70 characters or less").optional(),
  seoDescription: z
    .string()
    .trim()
    .max(160, "SEO description should be 160 characters or less")
    .optional(),
});

export type AdminBlogFormSchemaValues = z.infer<typeof adminBlogFormSchema>;

export const adminBlogEditorSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(180, "Title must be 180 characters or less"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  excerpt: z.string().trim().max(300, "Excerpt must be 300 characters or less").optional(),
  content: z.string().trim().min(20, "Content must be at least 20 characters"),
  featuredImage: z.string().trim().url("Use a valid image URL").optional().or(z.literal("")),
  category: z.string().trim().min(1, "Category is required"),
  tags: z.string().trim().max(240, "Tags must be 240 characters or less").optional(),
  status: z.enum(["draft", "scheduled", "published", "unpublished", "archived"]),
  featuredStatus: z.enum(["featured", "not_featured"]),
  seoTitle: z.string().trim().max(70, "SEO title should be 70 characters or less").optional(),
  seoDescription: z
    .string()
    .trim()
    .max(160, "SEO description should be 160 characters or less")
    .optional(),
});

export type AdminBlogEditorValues = z.infer<typeof adminBlogEditorSchema>;
