import Badge from "@/components/ui/Badge";

type AdminStatusBadgeProps = {
  status?: string;
};

const statusVariant: Record<string, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  approved: "success",
  hired: "success",
  offered: "success",
  shortlisted: "success",
  uploaded: "success",
  verified: "success",
  published: "success",
  featured: "success",
  resolved: "success",
  reviewed: "primary",
  applied: "primary",
  submitted: "primary",
  in_review: "primary",
  reviewing: "primary",
  interview: "primary",
  interview_scheduled: "primary",
  completed: "success",
  active_resume: "success",
  under_review: "primary",
  not_scheduled: "neutral",
  pending: "warning",
  new: "warning",
  pending_review: "warning",
  pending_verification: "warning",
  paused: "warning",
  draft: "warning",
  scheduled: "warning",
  escalated: "danger",
  critical: "danger",
  high: "warning",
  medium: "primary",
  low: "neutral",
  suspended: "warning",
  inactive: "neutral",
  archived: "neutral",
  unpublished: "neutral",
  not_featured: "neutral",
  closed: "neutral",
  expired: "neutral",
  hidden: "neutral",
  missing: "neutral",
  private: "neutral",
  public: "success",
  flagged: "danger",
  blocked: "danger",
  cancelled: "danger",
  withdrawn: "neutral",
  rejected: "danger",
  dismissed: "danger",
};

export default function AdminStatusBadge({ status = "unknown" }: AdminStatusBadgeProps) {
  const label = status.replace(/_/g, " ");

  return (
    <Badge variant={statusVariant[status] ?? "neutral"} className="capitalize">
      {label}
    </Badge>
  );
}
