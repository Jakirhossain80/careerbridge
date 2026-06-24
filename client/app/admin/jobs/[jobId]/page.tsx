import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default async function AdminJobDetailsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <AdminDetailPage resource="job" id={jobId} />;
}
