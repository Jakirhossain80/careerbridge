import AdminDetailPage from "@/components/admin/AdminDetailPage";

export default async function AdminCompanyDetailsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  return <AdminDetailPage resource="company" id={companyId} />;
}
