import type { AdminMeta } from "@/types/admin.types";

export type AdminReportEntityType =
  | "job"
  | "user"
  | "employer"
  | "company"
  | "blog"
  | "application"
  | "other";

export type AdminReportReason =
  | "fake_job"
  | "spam"
  | "harassment"
  | "fraud"
  | "misleading_information"
  | "duplicate_listing"
  | "policy_violation"
  | "other";

export type AdminReportStatus =
  | "new"
  | "under_review"
  | "resolved"
  | "dismissed"
  | "escalated"
  | "pending"
  | "reviewed";

export type AdminReportSeverity = "critical" | "high" | "medium" | "low";

export type AdminReport = {
  _id: string;
  reporterId?: string | { _id: string; name?: string; email?: string };
  reporterName?: string;
  reporterEmail?: string;
  reporterAvatar?: string;
  reportedEntityId?: string;
  reportedEntityType?: AdminReportEntityType;
  reportedEntityLabel?: string;
  targetId?: string;
  targetType?: AdminReportEntityType;
  targetLabel?: string;
  reason: AdminReportReason | string;
  severity?: AdminReportSeverity;
  status: AdminReportStatus;
  description?: string;
  evidence?: string[];
  moderatorNote?: string;
  resolutionNote?: string;
  assignedModeratorId?: string;
  reviewedBy?: string | { _id: string; name?: string; email?: string };
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
};

export type AdminReportFilters = {
  search?: string;
  severity?: AdminReportSeverity | "all";
  status?: AdminReportStatus | "all";
  reason?: AdminReportReason | "all";
  targetType?: AdminReportEntityType | "all";
  dateFrom?: string;
  dateTo?: string;
  reporter?: string;
  assignedModerator?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type AdminReportsResponse = {
  reports: AdminReport[];
  meta: AdminMeta;
};

export type AdminReportAnalytics = {
  severityCounts?: Partial<Record<AdminReportSeverity, number>>;
  trends?: Array<{ date: string; count: number }>;
  reasonDistribution?: Array<{
    reason: AdminReportReason | string;
    count: number;
    percentage: number;
  }>;
};

export type AdminReportAction =
  | "under_review"
  | "resolved"
  | "dismissed"
  | "escalated"
  | "suspend_account"
  | "remove_content";

export type AdminReportActionPayload = {
  status?: AdminReportStatus;
  moderatorNote?: string;
  resolutionNote?: string;
};
