import { z } from "zod";

export const adminReportActionSchema = z.object({
  action: z.enum([
    "under_review",
    "resolved",
    "dismissed",
    "escalated",
    "suspend_account",
    "remove_content",
  ]),
  moderatorNote: z.string().trim().max(1000, "Moderator note must be 1000 characters or less").optional(),
});

export type AdminReportActionValues = z.infer<typeof adminReportActionSchema>;
