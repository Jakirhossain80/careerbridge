import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationsPageContent from "@/components/notifications/NotificationsPageContent";

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsPageContent />
    </ProtectedRoute>
  );
}
