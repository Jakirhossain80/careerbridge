import Badge from "@/components/ui/Badge";

type AdminStatusBadgeProps = {
  status?: string;
};

const statusVariant: Record<string, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  approved: "success",
  published: "success",
  resolved: "success",
  reviewed: "primary",
  pending: "warning",
  draft: "warning",
  inactive: "neutral",
  archived: "neutral",
  closed: "neutral",
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
