import Badge from "@/components/ui/Badge";

type RoleBadgeProps = {
  role?: string;
};

export default function RoleBadge({ role = "unknown" }: RoleBadgeProps) {
  const variant = role === "admin" || role === "super_admin" ? "primary" : "neutral";

  return (
    <Badge variant={variant} className="capitalize">
      {role.replace(/_/g, " ")}
    </Badge>
  );
}
