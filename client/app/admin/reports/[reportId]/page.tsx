import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default async function AdminReportDetailsPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  return <AdminDetailPage resource="report" id={reportId} />;
}
