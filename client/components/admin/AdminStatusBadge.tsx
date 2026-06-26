import Badge from "@/components/ui/Badge";

type AdminStatusBadgeProps = {
  status?: string;
};

const statusVariant: Record<string, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  approved: "success",
  verified: "success",
  published: "success",
  resolved: "success",
  reviewed: "primary",
  under_review: "primary",
  pending: "warning",
  pending_review: "warning",
  pending_verification: "warning",
  draft: "warning",
  suspended: "warning",
  inactive: "neutral",
  archived: "neutral",
  closed: "neutral",
  expired: "neutral",
  hidden: "neutral",
  private: "neutral",
  public: "success",
  flagged: "danger",
  blocked: "danger",
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
