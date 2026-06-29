import { Bell } from "lucide-react";

import { EmptyState } from "@/components/ui";

export default function NotificationsEmptyState() {
  return (
    <EmptyState
      icon={<Bell className="size-6" aria-hidden="true" />}
      title="No notifications yet."
      description="Application updates, interview schedules, job decisions, and job alerts will appear here."
    />
  );
}
