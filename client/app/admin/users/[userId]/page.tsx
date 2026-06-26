import UserDetailsView from "@/components/admin/users/UserDetailsView";

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserDetailsView userId={userId} />;
}
