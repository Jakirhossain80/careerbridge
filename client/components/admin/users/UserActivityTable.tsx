import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import type { TableColumn } from "@/components/ui/Table";
import type { AdminUser } from "@/types/admin-user.types";

type Activity = NonNullable<AdminUser["recentActivity"]>[number];

type UserActivityTableProps = {
  activity?: AdminUser["recentActivity"];
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function UserActivityTable({ activity = [] }: UserActivityTableProps) {
  if (!activity.length) {
    return (
      <EmptyState
        title="No recent activity"
        description="Activity, logins, applications, job postings, and interview events will appear here when the API provides them."
      />
    );
  }

  const columns: Array<TableColumn<Activity>> = [
    {
      key: "action",
      header: "Activity",
      render: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.action}</p>
          <p className="mt-1 text-sm text-muted">{item.details || "No details provided."}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) =>
        item.status ? <AdminStatusBadge status={item.status} /> : "Not available",
    },
    {
      key: "timestamp",
      header: "Time",
      render: (item) => formatDate(item.timestamp),
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={activity}
      getRowKey={(item) => item.id}
      emptyMessage="No recent activity found."
    />
  );
}
