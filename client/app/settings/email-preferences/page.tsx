import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EmailPreferencesForm from "@/components/settings/EmailPreferencesForm";

export default function EmailPreferencesPage() {
  return (
    <ProtectedRoute>
      <EmailPreferencesForm />
    </ProtectedRoute>
  );
}
