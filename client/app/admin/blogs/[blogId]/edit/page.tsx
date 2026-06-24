import AdminBlogForm from "@/components/admin/AdminBlogForm";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  return <AdminBlogForm blogId={blogId} />;
}
