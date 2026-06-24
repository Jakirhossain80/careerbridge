import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default async function AdminApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  return <AdminDetailPage resource="application" id={applicationId} />;
}
