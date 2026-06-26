import BlogEditorForm from "@/components/admin/blogs/BlogEditorForm";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  return <BlogEditorForm blogId={blogId} />;
}
