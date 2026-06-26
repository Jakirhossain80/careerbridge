import { z } from "zod";

export const adminRoleChangeSchema = z.object({
  role: z.enum(["job_seeker", "employer", "admin", "super_admin"]),
});

export const adminModerationReasonSchema = z.object({
  reason: z.string().trim().max(1000).optional(),
});

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(120),
  slug: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
});

export const adminBlogSchema = z.object({
  title: z.string().trim().min(3, "Blog title is required").max(180),
  slug: z.string().trim().optional(),
  category: z.string().trim().optional(),
  content: z.string().trim().min(20, "Blog content must be at least 20 characters"),
  status: z.enum(["draft", "scheduled", "published", "unpublished", "archived"]),
});

export const adminReportStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "resolved", "dismissed"]),
  resolutionNote: z.string().trim().max(1000).optional(),
});

export type AdminRoleChangeValues = z.infer<typeof adminRoleChangeSchema>;
export type AdminCategoryValues = z.infer<typeof adminCategorySchema>;
export type AdminBlogValues = z.infer<typeof adminBlogSchema>;
export type AdminReportStatusValues = z.infer<typeof adminReportStatusSchema>;
