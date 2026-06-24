import Link from "next/link";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminDataTable from "@/components/admin/AdminDataTable";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { Button } from "@/components/ui";
import type { TableColumn } from "@/components/ui/Table";
import type { AdminActivityItem } from "@/types/admin-dashboard.types";

type RecentSystemActivityTableProps = {
  activity: AdminActivityItem[];
  onExport: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const columns: Array<TableColumn<AdminActivityItem>> = [
  {
    key: "action",
    header: "Activity",
    render: (item) => (
      <div>
        <p className="font-medium text-foreground">{item.action}</p>
        <p className="mt-1 text-xs text-muted">{item.entity}</p>
      </div>
    ),
  },
  {
    key: "timestamp",
    header: "Time",
    render: (item) => formatDate(item.timestamp),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <AdminStatusBadge status={item.status} />,
  },
  {
    key: "details",
    header: "Details",
    render: (item) =>
      item.detailsHref ? (
        <Link
          href={item.detailsHref}
          className="text-sm font-semibold text-primary transition hover:text-blue-700"
        >
          {item.detailsLabel ?? "View"}
        </Link>
      ) : (
        <span className="text-sm text-muted">Not available</span>
      ),
  },
];

export default function RecentSystemActivityTable({
  activity,
  onExport,
}: RecentSystemActivityTableProps) {
  return (
    <DashboardSection
      title="Recent System Activity"
      description="Latest registrations, postings, applications, and moderation events."
      action={
        <Button size="sm" variant="outline" onClick={onExport}>
          Export Logs
        </Button>
      }
    >
      <AdminDataTable
        columns={columns}
        data={activity}
        emptyMessage="No recent system activity yet."
        getRowKey={(item) => item._id}
      />
    </DashboardSection>
  );
}
