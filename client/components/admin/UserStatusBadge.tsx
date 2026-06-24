import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

export default function UserStatusBadge({ status }: { status?: string }) {
  return <AdminStatusBadge status={status} />;
}
