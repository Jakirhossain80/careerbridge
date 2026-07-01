import Badge from "@/components/ui/Badge";
import { getRoleLabel } from "@/lib/role-labels";

type RoleBadgeProps = {
  role?: string;
};

export default function RoleBadge({ role = "unknown" }: RoleBadgeProps) {
  const variant = role === "admin" || role === "super_admin" ? "primary" : "neutral";

  return (
    <Badge variant={variant}>
      {getRoleLabel(role)}
    </Badge>
  );
}
