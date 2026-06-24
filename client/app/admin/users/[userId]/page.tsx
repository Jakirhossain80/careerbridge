import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <AdminDetailPage resource="user" id={userId} />;
}
