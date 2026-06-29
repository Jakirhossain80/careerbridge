import { LayoutDashboard } from "lucide-react";

import { EmptyState } from "@/components/ui";

type DashboardEmptyStateProps = {
  title?: string;
  description?: string;
};

export default function DashboardEmptyState({
  title = "No dashboard data available yet",
  description = "Activity will appear here once records are created.",
}: DashboardEmptyStateProps) {
  return (
    <EmptyState
      icon={<LayoutDashboard className="size-6" aria-hidden="true" />}
      title={title}
      description={description}
    />
  );
}
