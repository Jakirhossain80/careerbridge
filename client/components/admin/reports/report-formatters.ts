import type {
  AdminReport,
  AdminReportEntityType,
  AdminReportReason,
  AdminReportSeverity,
  AdminReportStatus,
} from "@/types/admin-report";

export const reportStatusOptions: Array<{ label: string; value: AdminReportStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "New", value: "new" },
  { label: "Under Review", value: "under_review" },
  { label: "Escalated", value: "escalated" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
];

export const reportSeverityOptions: Array<{ label: string; value: AdminReportSeverity | "all" }> = [
  { label: "All severities", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const reportReasonOptions: Array<{ label: string; value: AdminReportReason | "all" }> = [
  { label: "All reasons", value: "all" },
  { label: "Fake job", value: "fake_job" },
  { label: "Spam", value: "spam" },
  { label: "Harassment", value: "harassment" },
  { label: "Fraud", value: "fraud" },
  { label: "Misleading information", value: "misleading_information" },
  { label: "Duplicate listing", value: "duplicate_listing" },
  { label: "Policy violation", value: "policy_violation" },
  { label: "Other", value: "other" },
];

export const reportEntityTypeOptions: Array<{ label: string; value: AdminReportEntityType | "all" }> = [
  { label: "All entity types", value: "all" },
  { label: "Job", value: "job" },
  { label: "User", value: "user" },
  { label: "Employer", value: "employer" },
  { label: "Company", value: "company" },
  { label: "Blog", value: "blog" },
  { label: "Application", value: "application" },
  { label: "Other", value: "other" },
];

export function normalizeReportStatus(status: AdminReportStatus): AdminReportStatus {
  if (status === "pending") return "new";
  if (status === "reviewed") return "under_review";
  return status;
}

export function getReporterName(report: AdminReport) {
  if (report.reporterName) return report.reporterName;
  if (typeof report.reporterId === "object" && report.reporterId.name) return report.reporterId.name;
  return report.reporterEmail?.split("@")[0] ?? "Unknown reporter";
}

export function getReporterEmail(report: AdminReport) {
  if (report.reporterEmail) return report.reporterEmail;
  if (typeof report.reporterId === "object" && report.reporterId.email) return report.reporterId.email;
  return "Email unavailable";
}

export function getReporterInitials(report: AdminReport) {
  return getReporterName(report)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getReportEntityType(report: AdminReport) {
  return report.reportedEntityType ?? report.targetType ?? "other";
}

export function getReportEntityLabel(report: AdminReport) {
  return report.reportedEntityLabel ?? report.targetLabel ?? report.reportedEntityId ?? report.targetId ?? "Unknown entity";
}

export function formatReportLabel(value: string) {
  return value.replace(/_/g, " ");
}

export function formatReportDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
