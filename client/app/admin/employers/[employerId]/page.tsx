import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default async function AdminEmployerDetailsPage({
  params,
}: {
  params: Promise<{ employerId: string }>;
}) {
  const { employerId } = await params;
  return <AdminDetailPage resource="employer" id={employerId} />;
}
