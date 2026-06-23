import Link from "next/link";

import { Badge, Card } from "@/components/ui";
import type { JobSeekerDashboardNotification } from "@/types/job-seeker-dashboard.types";

type JobSeekerNotificationsCardProps = {
  notifications: JobSeekerDashboardNotification[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function JobSeekerNotificationsCard({
  notifications,
}: JobSeekerNotificationsCardProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Notifications</h2>
          <p className="mt-1 text-sm text-muted">
            Job alerts and application updates
          </p>
        </div>
      }
    >
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {notification.title}
                  </h3>
                  {!notification.read ? <Badge variant="primary">New</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted">{notification.message}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">
                {formatDate(notification.createdAt)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            No notifications yet.
          </p>
          <Link
            href="/profile/job-alerts"
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:text-blue-700"
          >
            Manage job alerts
          </Link>
        </div>
      )}
    </Card>
  );
}
