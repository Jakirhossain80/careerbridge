import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationDetailView from "@/components/notifications/NotificationDetailView";

type NotificationDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotificationDetailsPage({
  params,
}: NotificationDetailsPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <NotificationDetailView notificationId={id} />
    </ProtectedRoute>
  );
}
